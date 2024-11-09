import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MonsterHarvestComponent} from './monster-harvest/monster-harvest.component';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {DragDropModule} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [
        RouterOutlet,
        MonsterHarvestComponent,
        CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'monster-harvest';
}
