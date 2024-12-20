import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from '../../service/master.service';

@Component({
  selector: 'app-booking',
  imports: [],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {
  scheduleId: number = 0;
  scehduielData: any;

  seatArray: number[] = [];
  bookedSeatsArray: number[] = [];

  constructor(
    private activatedRouet: ActivatedRoute,
    private masterSrv: MasterService
  ) {
    this.activatedRouet.params.subscribe((res: any) => {
      this.scheduleId = res.id;
      this.getSceduleDetaisById();
      this.getBookedSeats();
    });
  }

  getSceduleDetaisById() {
    this.masterSrv.getScehduelById(this.scheduleId).subscribe((res: any) => {
      this.scehduielData = res;
      for (let index = 1; index < this.scehduielData.length; index++) {
        this.seatArray.push(index);
      }
    });
  }

  getBookedSeats() {
    this.masterSrv.getBookedSeats(this.scheduleId).subscribe((res: any) => {
      this.bookedSeatsArray = res;
    });
  }

  checkIfSeatBooked(seatNo: number) {
    return this.bookedSeatsArray.indexOf(seatNo);
  }
}
