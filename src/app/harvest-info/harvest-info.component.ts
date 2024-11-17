import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-harvest-info',
  standalone: true,
    imports: [CommonModule, MatDivider],
  templateUrl: './harvest-info.component.html',
  styleUrl: './harvest-info.component.scss'
})
export class HarvestInfoComponent implements OnInit {
    public harvestSkill = '';
    public harvestSkillColor = '';
    @Input() selectedType: string = '';
    @Output() closeAlert = new EventEmitter<void>();

    ngOnInit() {
        this.harvestSkill = this.selectedType ? (this.creatureTypesAndSkills)[this.selectedType].harvestSkill : 'skill proficiency';
        this.harvestSkillColor = this.harvestSkillColors[this.harvestSkill];
    }

    public close() {
        this.closeAlert.emit();
    }

    public creatureTypesAndSkills: { [key: string] : { harvestSkill: string, ritual: boolean } } = {
        'Aberration': { harvestSkill: 'Arcana', ritual: true },
        'Beast': { harvestSkill: 'Survival', ritual: false },
        'Celestial': { harvestSkill: 'Religion', ritual: true },
        'Construct': { harvestSkill: 'Investigation', ritual: false },
        'Dragon': { harvestSkill: 'Survival', ritual: false },
        'Elemental': { harvestSkill: 'Arcana', ritual: true },
        'Fey': { harvestSkill: 'Arcana', ritual: true },
        'Fiend': { harvestSkill: 'Religion', ritual: true },
        'Giant': { harvestSkill: 'Medicine', ritual: false },
        'Humanoid': { harvestSkill: 'Medicine', ritual: false },
        'Monstrosity': { harvestSkill: 'Survival', ritual: false },
        'Ooze': { harvestSkill: 'Nature', ritual: false },
        'Plant': { harvestSkill: 'Nature', ritual: false },
        'Undead': { harvestSkill: 'Medicine', ritual: false },
    }

    public harvestSkillColors: { [key: string]: string } = {
        'Survival': 'bg-orange-700',
        'Religion': 'bg-amber-500',
        'Medicine': 'bg-pink-700',
        'Nature': 'bg-green-600',
        'Arcana': 'bg-purple-900',
        'Investigation': 'bg-cyan-600',
    };

}
