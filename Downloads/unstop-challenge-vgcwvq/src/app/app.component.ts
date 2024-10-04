import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  totalSeats = 80; // Total number of seats in the coach
  seatsPerRow = 7; // Maximum seats per row (except the last row)
  rows = Math.floor(this.totalSeats / this.seatsPerRow); // Number of full rows
  lastRowSeats = this.totalSeats % this.seatsPerRow; // Seats in the last row
  seatMap: any[] = []; // 2D array representing seats (true means reserved, false means available)
  reservedSeats: number[] = []; // Array to keep track of reserved seat numbers

  constructor() {
    // Initialize the seating map when the component is created
    this.initializeSeats();
  }

  // Method to create seat map: fill rows with available seats
  initializeSeats() {
    for (let i = 0; i < this.rows; i++) {
      this.seatMap.push(Array(this.seatsPerRow).fill(false)); // Fill full rows
    }
    if (this.lastRowSeats > 0) {
      // Handle the last row with fewer seats
      this.seatMap.push(Array(this.lastRowSeats).fill(false));
    }
  }

  // Method to handle seat booking request
  bookSeats(requestedSeats: number) {
    if (requestedSeats > 7 || requestedSeats < 1) {
      // Validation: Ensure the number of requested seats is between 1 and 7
      alert('You can only book between 1 to 7 seats.');
      return;
    }

    let totalAvailableSeats = 0;

    // Calculate total available seats across all rows
    for (let row = 0; row < this.seatMap.length; row++) {
      totalAvailableSeats += this.seatMap[row].filter(
        (seat: boolean) => !seat
      ).length;
    }

    // If not enough seats are available, show an alert
    if (totalAvailableSeats < requestedSeats) {
      alert('Not enough seats available.');
      return;
    }

    const bookedSeats = [];

    // First, attempt to book all requested seats in the same row
    for (let row = 0; row < this.seatMap.length; row++) {
      let freeSeatsInRow = this.seatMap[row]
        .map((seat: boolean, index: number) => (seat ? null : index)) // Get indices of available seats
        .filter((seat: number | null) => seat !== null); // Filter out reserved seats
      if (freeSeatsInRow.length >= requestedSeats) {
        // If enough free seats are found in this row
        for (let i = 0; i < requestedSeats; i++) {
          this.seatMap[row][freeSeatsInRow[i]] = true; // Mark seats as reserved
          bookedSeats.push(this.getSeatNumber(row, freeSeatsInRow[i])); // Store the seat number
        }
        this.reservedSeats.push(...bookedSeats); // Add to reserved seats array
        return bookedSeats; // Return booked seat numbers
      }
    }

    // If unable to book in the same row, book nearby seats in other rows
    for (let row = 0; row < this.seatMap.length; row++) {
      for (
        let seat = 0;
        seat < this.seatMap[row].length && bookedSeats.length < requestedSeats;
        seat++
      ) {
        if (!this.seatMap[row][seat]) {
          // If seat is available
          this.seatMap[row][seat] = true; // Mark seat as reserved
          bookedSeats.push(this.getSeatNumber(row, seat)); // Store the seat number
        }
      }
    }

    this.reservedSeats.push(...bookedSeats); // Add booked seats to the reserved array
    return bookedSeats; // Return booked seat numbers
  }

  // Helper function to calculate seat number based on row and seat indices
  getSeatNumber(row: number, seat: number) {
    let seatNumber = row * this.seatsPerRow + seat + 1; // Calculate seat number
    return seatNumber <= 80 ? seatNumber : null; // Ensure seat number does not exceed total seats
  }
}
