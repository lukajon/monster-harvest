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

const METADATA_KEY = "com.lukajon.monsterHarvest/harvestData";

interface HarvestMetadata {
    toHarvest: any[];
    notToHarvest: any[];
    sizeMessage: string;
    crMessage: string;
    currentDC: number;
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
        MatIcon
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
    public toHarvest: MonsterComponent[] = [];
    public notToHarvest: MonsterComponent[] = [];
    public currentDC: number = 0;
    public displayedColumns: string[] = ['dc', 'type', 'creature component'];
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
                this.toHarvest = data.toHarvest || [];
                this.notToHarvest = data.notToHarvest || [];
                this.sizeMessage = data.sizeMessage;
                this.crMessage = data.crMessage;
                this.currentDC = data.currentDC;
                console.log("Harvest data loaded successfully.");
                this.toHarvestTable?.renderRows();
                this.notToHarvestTable?.renderRows();
                this.cdr.detectChanges();
            } else {
                // If no data is present, initialize the lists as empty
                this.resetHarvestData();
            }
        });
    }

    // Save `toHarvest` and `notToHarvest` lists to Owlbear metadata
    private async saveHarvestData(): Promise<void> {
        try {
            await OBR.room.setMetadata({
                [METADATA_KEY]: {
                    toHarvest: this.toHarvest,
                    notToHarvest: this.notToHarvest,
                    sizeMessage: this.sizeMessage,
                    crMessage: this.crMessage,
                    currentDC: this.currentDC
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
                this.toHarvest = data.toHarvest || [];
                this.notToHarvest = data.notToHarvest || [];
                this.sizeMessage = data.sizeMessage;
                this.crMessage = data.crMessage;
                this.currentDC = data.currentDC;
                console.log("Harvest data loaded successfully.");

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
        this.sizeMessage = '';
        this.crMessage = '';
        this.currentDC = 0;
    }

    public toggleDMMode(): void {
        this.dmMode = !this.dmMode;
    }

    // Load components based on the selected monster type
    public async onMonsterTypeChange(event: Event): Promise<void> {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedType = selectElement.value;
        this.loadMonsterComponents(this.selectedType);
        if (this.selectedEssence) {
            this.addEssenceToAvailable(this.selectedEssence);
        }

        await this.saveHarvestData();
    }

    public async onMonsterSizeChange(event: Event): Promise<void> {
        const selectedSize = (event.target as HTMLSelectElement).value;
        this.sizeMessage = this.sizeMessages[selectedSize] || '';

        await this.saveHarvestData();
    }

    public async onMonsterCRChange(event: Event): Promise<void> {
        const selectedCR = (event.target as HTMLSelectElement).value;
        this.crMessage = this.crEssences[selectedCR]?.message || '';

        if (this.selectedEssence) {
            this.removeEssenceFromAvailable(this.selectedEssence);
        }

        const essence = this.crEssences[selectedCR]?.essence;
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
            this.toHarvestTable?.renderRows();
            this.notToHarvestTable?.renderRows();
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
            this.toHarvestTable?.renderRows();
            this.notToHarvestTable?.renderRows();

            this.calculateDC();
        }

        await this.saveHarvestData();
    }

    // Populate "To Harvest" and "Not to Harvest" lists with creature components
    private loadMonsterComponents(type: keyof MonsterComponents): void {
        this.notToHarvest = monsterComponents[type].flatMap((entry) =>
            entry.creatureComponent.map((component) => ({
                dc: entry.dc,
                type: type.toString(),
                component: component,
                id: `${type}-${entry.dc}-${component}`,
            }))
        );
        this.toHarvest = [];
    }

    private calculateDC(): void {
        this.currentDC = this.toHarvest.reduce((total, component) => total + component.dc, 0);
    }

    private sizeMessages: { [key: string]: string } = {
        Tiny: 'Harvesting takes 5 minutes.',
        Small: 'Harvesting takes 10 minutes.',
        Medium: 'Harvesting takes 15 minutes.',
        Large: 'Harvesting takes 30 minutes.',
        Huge: 'Harvesting takes 2 hours.',
        Gargantuan: 'Harvesting takes 12 hours.',
    };

    private crEssences: { [key: string]: { message: string, essence: MonsterComponent | null } } = {
        'less than 3': { message: 'You cannot extract an essence.', essence: null },
        '3 to 6': { message: 'Frail essence can be extracted. Used for uncommon magic items.', essence: { dc: 25, type: 'essence', component: 'Frail Essence', id: 'essence-3-6' }},
        '7 to 11': { message: 'Robust essence can be extracted. Used for rare magic items.', essence: { dc: 30, type: 'essence', component: 'Robust Essence', id: 'essence-7-11' }},
        '12 to 17': { message: 'Potent essence can be extracted. Used for very rare magic items.', essence: { dc: 35, type: 'essence', component: 'Potent Essence', id: 'essence-12-17' }},
        '18 to 24': { message: 'Mythic essence can be extracted. Used for legendary magic items.', essence: { dc: 40, type: 'essence', component: 'Mythic Essence', id: 'essence-18-24' }},
        '25+': { message: 'Deific essence can be extracted. Used for artifacts.', essence: { dc: 50, type: 'essence', component: 'Deific Essence', id: 'essence-25+' }},
    };

    private addEssenceToAvailable(essence: MonsterComponent): void {
        this.notToHarvest.push(essence);
    }

    private removeEssenceFromAvailable(essence: MonsterComponent): void {
        this.notToHarvest = this.notToHarvest.filter(component => component.id !== essence.id);
    }
}
