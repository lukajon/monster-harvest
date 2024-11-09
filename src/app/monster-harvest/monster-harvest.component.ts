import {Component, ViewChild} from '@angular/core';
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
export class MonsterHarvestComponent {
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

    public toggleDMMode(): void {
        this.dmMode = !this.dmMode;
    }

    // Load components based on the selected monster type
    public onMonsterTypeChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedType = selectElement.value;
        this.loadMonsterComponents(this.selectedType);
        if (this.selectedEssence) {
            this.addEssenceToAvailable(this.selectedEssence);
        }
    }

    public onMonsterSizeChange(event: Event): void {
        const selectedSize = (event.target as HTMLSelectElement).value;
        this.sizeMessage = this.sizeMessages[selectedSize] || '';
    }

    public onMonsterCRChange(event: Event): void {
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
    }

    public drop(event: CdkDragDrop<MonsterComponent[]>) {
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
