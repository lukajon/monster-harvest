import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MonsterComponent, MonsterComponents, monsterComponents} from '../data/monsterComponents';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDropList,
    CdkDropListGroup,
    DragDropModule, moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import OBR from '@owlbear-rodeo/sdk';
import {MatIconButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {HarvestInfoComponent} from '../harvest-info/harvest-info.component';

const METADATA_KEY = "com.lukajon.monsterHarvest/harvestData";

interface HarvestMetadata {
    toHarvest: any[];
    notToHarvest: any[];
    selectedType: string;
    selectedSize: string;
    selectedCR: string;
    currentDC: number;
    harvestCheck: number;
}

@Component({
    selector: 'app-monster-harvest',
    standalone: true,
    imports: [
        CommonModule,
        CdkDropList,
        CdkDropListGroup,
        CdkDrag,
        MatTableModule,
        DragDropModule,
        MatIcon,
        MatIconButton,
        MatFormFieldModule,
        MatInputModule,
        HarvestInfoComponent
    ],
    templateUrl: './monster-harvest.component.html',
    styleUrl: './monster-harvest.component.scss'
})
export class MonsterHarvestComponent implements OnInit, OnDestroy {
    public dmMode: boolean = false;
    public monsterTypes = Object.keys(monsterComponents);
    public monsterSizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
    public sizeMessage = '';
    public monsterCR = ['less than 3', '3 to 6', '7 to 11', '12 to 17', '18 to 24', '25+'];
    public crMessage: string = '';
    public selectedEssence: MonsterComponent | null = null;
    public selectedType: string = '';
    public selectedSize = '';
    public selectedCR = '';
    public toHarvest: MonsterComponent[] = [];
    public notToHarvest: MonsterComponent[] = [];
    public currentDC: number = 0;
    public harvestCheck: number = 0;
    public showInfoAlert = false;
    public displayedColumns: string[] = ['dc', 'type', 'creature component'];
    public displayedColumnsHarvestList: string[] = ['cumulativeDC', 'dc', 'type', 'creature component'];
    @ViewChild('toHarvestTable', {static: true}) toHarvestTable: MatTable<MonsterComponent> | undefined;
    @ViewChild('notToHarvestTable', {static: true}) notToHarvestTable: MatTable<MonsterComponent> | undefined;


    private unsubscribeFromMetadataChange: (() => void) | undefined;

    constructor(private cdr: ChangeDetectorRef) {} // Inject ChangeDetectorRef

    ngOnInit(): void {
        // Wait until OBR SDK is ready, then set up listeners and load initial data
        OBR.onReady(() => {
            this.subscribeToMetadataChanges();
            this.loadHarvestData();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from metadata changes when the component is destroyed
        if (this.unsubscribeFromMetadataChange) {
            this.unsubscribeFromMetadataChange();
        }
    }

    private subscribeToMetadataChanges(): void {
        // Listen for changes in the room metadata
        this.unsubscribeFromMetadataChange = OBR.room.onMetadataChange((metadata) => {
            const data = metadata[METADATA_KEY] as HarvestMetadata | undefined;
            console.log("Metadata changed:", data);

            if (data) {
                // Update local lists with the shared data
                this.updateLocalLists(data);
            } else {
                // If no data is present, initialize the lists as empty
                this.resetHarvestData();
            }
        });
    }

    private updateLocalLists(data: HarvestMetadata) {
        this.toHarvest = data.toHarvest || [];
        this.notToHarvest = data.notToHarvest || [];
        this.selectedType = data.selectedType;
        this.selectedSize = data.selectedSize;
        console.log(this.selectedSize);
        this.setSizeMessage(this.selectedSize);
        console.log(this.sizeMessage);
        this.selectedCR = data.selectedCR;
        this.setCRMessage(this.selectedCR);
        this.setSelectedEssence(this.selectedCR);
        this.currentDC = data.currentDC;
        this.harvestCheck = data.harvestCheck;

        console.log("Harvest data loaded successfully.");

        this.toHarvestTable?.renderRows();
        this.notToHarvestTable?.renderRows();
        this.cdr.detectChanges();
    }

// Save `toHarvest` and `notToHarvest` lists to Owlbear metadata
    private async saveHarvestData(): Promise<void> {
        try {
            await OBR.room.setMetadata({
                [METADATA_KEY]: {
                    toHarvest: this.toHarvest,
                    notToHarvest: this.notToHarvest,
                    selectedType: this.selectedType,
                    selectedSize: this.selectedSize,
                    selectedCR: this.selectedCR,
                    currentDC: this.currentDC,
                    harvestCheck: this.harvestCheck
                }
            });
            console.log("Harvest data saved successfully.");
        } catch (error) {
            console.error("Failed to save harvest data:", error);
        }
    }

    // Load `toHarvest` and `notToHarvest` lists from Owlbear metadata
    private async loadHarvestData(): Promise<void> {
        try {
            const metadata = await OBR.room.getMetadata();
            const data = metadata[METADATA_KEY] as HarvestMetadata | undefined;

            if (data) {
                // Populate `toHarvest` and `notToHarvest` if data exists
                this.updateLocalLists(data);
                console.log("Harvest data loaded successfully.");
                console.log('Harvest Data:', data);

                // Trigger change detection to update the view
                this.cdr.detectChanges();
            } else {
                console.log("No harvest data found in metadata.");
            }
        } catch (error) {
            console.error("Failed to load harvest data:", error);
        }
    }

    // Reset harvest data if no metadata exists
    private resetHarvestData(): void {
        this.toHarvest = [];
        this.notToHarvest = [];
        this.selectedType = '';
        this.selectedSize = '';
        this.selectedCR = '';
        this.currentDC = 0;
        this.harvestCheck = 0;
    }

    public toggleDMMode(): void {
        this.dmMode = !this.dmMode;
        this.notToHarvestTable?.renderRows();
    }

    // Load components based on the selected monster type
    public async onMonsterTypeChange(event: Event): Promise<void> {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedType = selectElement.value;
        this.loadMonsterComponents(this.selectedType);
        console.log('before selectedEssence: ', this.selectedEssence);
        if (this.selectedEssence) {
            console.log('selectedEssence');
            this.addEssenceToAvailable(this.selectedEssence);
        }

        await this.saveHarvestData();
    }

    public async onMonsterSizeChange(event: Event): Promise<void> {
        this.selectedSize = (event.target as HTMLSelectElement).value;
        this.setSizeMessage(this.selectedSize);

        await this.saveHarvestData();
    }

    public async onMonsterCRChange(event: Event): Promise<void> {
        this.selectedCR = (event.target as HTMLSelectElement).value;
        this.setCRMessage(this.selectedCR);

        if (this.selectedEssence) {
            this.removeEssenceFromAvailable();
        }

        this.setSelectedEssence(this.selectedCR);
        const essence = this.selectedEssence;
        if (essence) {
            this.addEssenceToAvailable(essence);
        }

        this.selectedEssence = essence;
        this.notToHarvestTable?.renderRows();

        await this.saveHarvestData();
    }

    public async drop(event: CdkDragDrop<MonsterComponent[]>) {

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            // component from the list it is moved away from
            const movedComponent = event.item.data;
            // event.container is the table it gets moved to
            if (event.container.id === 'toHarvestTable') {
                movedComponent.active = false;
            } else {
                this.setComponentActiveState(movedComponent.id);
            }

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );

            this.calculateDC();
        }

        this.toHarvestTable?.renderRows();
        this.notToHarvestTable?.renderRows();

        await this.saveHarvestData();
        this.cdr.detectChanges();
    }

    public moveToHarvest(component: MonsterComponent): void {
        component.active = false;

        const index = this.notToHarvest.findIndex(comp => comp.id === component.id);
        if (index !== -1) {
            this.notToHarvest.splice(index, 1);
        }

        this.toHarvest.push(component);
        this.calculateDC();

        this.toHarvestTable?.renderRows();
        this.notToHarvestTable?.renderRows();

        this.saveHarvestData();
    }

    public moveToNotToHarvest(component: MonsterComponent): void {
        component.active = true;

        const index = this.toHarvest.findIndex(comp => comp.id === component.id);
        if (index !== -1) {
            this.toHarvest.splice(index, 1);
        }

        this.notToHarvest.push(component);
        this.calculateDC();

        this.sortComponents();

        this.toHarvestTable?.renderRows();
        this.notToHarvestTable?.renderRows();

        this.saveHarvestData();
    }

    private setComponentActiveState(componentId: string): void {
        // Find the component in notToHarvest with the matching ID and set its active state
        const component = this.notToHarvest.find(comp => comp.id === componentId && !comp.active);
        if (component) {
            component.active = true;
        }
    }

    public async cloneComponent(component: MonsterComponent): Promise<void> {
        const clonedComponent = {...component};
        clonedComponent.active = true;
        this.notToHarvest.push(clonedComponent);
        this.sortComponents();

        this.notToHarvestTable?.renderRows();
        await this.saveHarvestData();
    }

    private sortComponents() {
        this.notToHarvest.sort((a, b) => {
            if (a.dc !== b.dc) {
                return a.dc - b.dc;
            }
            return a.component.localeCompare(b.component);
        });
    }

    public async toggleActive(component: MonsterComponent): Promise<void> {
        component.active = !component.active;
        this.notToHarvest = [...this.notToHarvest];
        this.cdr.detectChanges();
        this.notToHarvestTable?.renderRows();
        await this.saveHarvestData();
    }

    public get activeNotToHarvest(): MonsterComponent[] {
        return this.notToHarvest.filter(component => component.active);
    }

    // Populate "To Harvest" and "Not to Harvest" lists with creature components
    private loadMonsterComponents(type: keyof MonsterComponents): void {
        this.notToHarvest = monsterComponents[type].flatMap((entry) =>
            entry.creatureComponent.map((component) => ({
                dc: entry.dc,
                type: type.toString(),
                component: component,
                id: `${entry.dc}-${type}-${component}`,
                active: false,
            }))
        );
        this.toHarvest = [];
    }

    private calculateDC(): void {
        this.currentDC = this.toHarvest.reduce((total, component) => total + component.dc, 0);
    }

    public updateHarvestCheck(event: Event): void {
        const inputValue = (event.target as HTMLInputElement).value;
        this.harvestCheck = inputValue ? parseInt(inputValue, 10) : 0;
        this.saveHarvestData();
    }

    public calculateCumulativeDC(index: number): number {
        let cumulativeDC = 0;
        for (let i = 0; i <= index; i++) {
            cumulativeDC += this.toHarvest[i]?.dc || 0;
        }
        return cumulativeDC;
    }

    public openCheckInfo() {
        this.showInfoAlert = true;
    }

    public closeCheckInfo(): void {
        this.showInfoAlert = false;
    }

    private sizeMessages: { [key: string]: string } = {
        Tiny: '5 min',
        Small: '10 min',
        Medium: '15 min',
        Large: '30 min',
        Huge: '2 hours',
        Gargantuan: '12 hours',
    };

    private crEssences: { [key: string]: { message: string, essence: MonsterComponent | null } } = {
        'less than 3': { message: 'None', essence: null },
        '3 to 6': { message: 'Frail (uncommon)', essence: { dc: 25, type: 'Essence', component: 'Frail Essence', id: 'essence-3-6', active: true }},
        '7 to 11': { message: 'Robust (rare)', essence: { dc: 30, type: 'Essence', component: 'Robust Essence', id: 'essence-7-11', active: true }},
        '12 to 17': { message: 'Potent (very rare)', essence: { dc: 35, type: 'Essence', component: 'Potent Essence', id: 'essence-12-17', active: true }},
        '18 to 24': { message: 'Mythic (legendary)', essence: { dc: 40, type: 'Essence', component: 'Mythic Essence', id: 'essence-18-24', active: true }},
        '25+': { message: 'Deific (artifacts)', essence: { dc: 50, type: 'Essence', component: 'Deific Essence', id: 'essence-25+', active: true }},
    };

    // private crEssences: { [key: string]: { name: string, message: string, essence: MonsterComponent | null } } = {
    //     'less than 3': { name: 'No essence', message: 'You cannot extract an essence.', essence: null },
    //     '3 to 6': { name: 'Frail essence (uncommon)', message: 'Frail essence can be extracted. Used for uncommon magic items.', essence: { dc: 25, type: 'essence', component: 'Frail Essence', id: 'essence-3-6', active: true }},
    //     '7 to 11': { name: 'Robust essence (rare)', message: 'Robust essence can be extracted. Used for rare magic items.', essence: { dc: 30, type: 'essence', component: 'Robust Essence', id: 'essence-7-11', active: true }},
    //     '12 to 17': { name: 'Potent essence (very rare)', message: 'Potent essence can be extracted. Used for very rare magic items.', essence: { dc: 35, type: 'essence', component: 'Potent Essence', id: 'essence-12-17', active: true }},
    //     '18 to 24': { name: 'Mythic essence (legendary)', message: 'Mythic essence can be extracted. Used for legendary magic items.', essence: { dc: 40, type: 'essence', component: 'Mythic Essence', id: 'essence-18-24', active: true }},
    //     '25+': { name: 'Deific essence (artifacts)', message: 'Deific essence can be extracted. Used for artifacts.', essence: { dc: 50, type: 'essence', component: 'Deific Essence', id: 'essence-25+', active: true }},
    // };

    private addEssenceToAvailable(essence: MonsterComponent): void {
        this.notToHarvest.push(essence);
    }

    private removeEssenceFromAvailable(): void {
        this.notToHarvest = this.notToHarvest.filter(component => component.type !== 'essence');
    }

    private setSizeMessage(selectedSize: string) {
        this.sizeMessage = this.sizeMessages[selectedSize] || '';
    }

    private setCRMessage(selectedCR: string) {
        this.crMessage = this.crEssences[selectedCR]?.message || '';
    }

    private setSelectedEssence(selectedCR: string) {
        this.selectedEssence = this.crEssences[selectedCR]?.essence;
    }
}
