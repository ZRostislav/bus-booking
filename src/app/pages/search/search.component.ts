import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [AsyncPipe, FormsModule, DatePipe, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  locations$: Observable<any[]> = new Observable<any[]>();
  masterSrv = inject(MasterService);
  busList: any[] = [];

  serachObj: any = {
    fromLocation: '',
    toLocation: '',
    travelDate: '',
  };

  ngOnInit(): void {
    this.getAllLocations();
  }

  getAllLocations() {
    this.locations$ = this.masterSrv.getLocations();
  }

  onSearch() {
    const { fromLocation, toLocation, travelDate } = this.serachObj;

    const startLocation = fromLocation || 0; // если fromLocation не задан, то 0
    const endLocation = toLocation || 0; // если toLocation не задан, то 0

    if (!travelDate) {
      const startDate = new Date('2024-010-01');
      const endDate = new Date('2024-12-31');

      this.busList = [];

      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const formattedDate = this.formatDate(date);

        // Перебор значений от 0 до 10 для fromLocation и toLocation
        for (let from = 0; from <= 10; from++) {
          for (let to = 0; to <= 10; to++) {
            this.masterSrv
              .searchBus(from, to, formattedDate)
              .subscribe((res: any) => {
                this.busList.push(...res);
              });
          }
        }
      }
    } else {
      this.masterSrv
        .searchBus(startLocation, endLocation, travelDate)
        .subscribe((res: any) => {
          this.busList = res;
        });
    }
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }
}
