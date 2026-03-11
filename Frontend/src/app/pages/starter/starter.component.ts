import { Component, ViewEncapsulation } from '@angular/core';
import { MatrixTableComponent } from "./matrix-table/matrix-table.component";
import { QualityDashbaord } from '../dashboard/quality-dashbaord/quality-dashbaord';


interface DashboardStats {
  totalSheets: number;
  totalAmount: number;
  averageCost: number;
  sheetsThisMonth: number;
  monthlyGrowth: number;
}

interface RecentSheet {
  id: number;
  sheetNo: string;
  productName: string;
  date: string;
  totalAmount: number;
  status: string;
}

interface MonthlyData {
  month: string;
  sheets: number;
  revenue: number;
}

@Component({
  selector: 'app-starter',
  imports: [MatrixTableComponent,
    QualityDashbaord
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './starter.component.scss'
})
export class StarterComponent { 
}