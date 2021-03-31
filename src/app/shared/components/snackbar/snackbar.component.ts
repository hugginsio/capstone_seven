import { Component, Input } from '@angular/core';
import { BasicSnack, Snack, SnackAction } from './interfaces/snackbar.interface';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent {

  @Input() max = 3;
  @Input() timeout: number;
  @Input() position: 'top' | 'bottom';

  public snacks: Array<Snack> = [];

  constructor(
    private readonly snackbarService: SnackbarService
  ) {
    this.position ?? 'bottom';
    this.snackbarService.get().subscribe(snack => {
      if (snack.action === SnackAction.ADD) {
        this.add(snack.data);
      } else if (snack.action === SnackAction.REMOVE) {
        this.remove(snack.id);
      } else if (snack.action === SnackAction.CLEAR) {
        this.clear();
      }
    });
  }

  add(data: BasicSnack): void {
    const newId = this.uuidv4();
    if (this.snacks.length < this.max) {
      this.snacks.push({
        message: data.message,
        id: newId,
        timer: this.timeout ? setTimeout(() => { this.remove(newId); }, this.timeout) : null
      });
    } else {
      console.error(`Too many snacks. Max of ${this.max}.`);
    }
  }

  remove(id: string): void {
    const snack = this.snacks.find(object => object.id === id);
    if (snack) {
      if (snack.timer) {
        clearInterval(snack.timer);
      }
    } else {
      console.error(`Snack with UUID "${id}" does not exist.`);
    }

    this.snacks = this.snacks.filter(object => object.id !== id);
  }

  clear(): void {
    this.snacks.splice(0, this.snacks.length);
  }

  // CC BY-SA 4.0
  // https://stackoverflow.com/a/2117523
  private uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getPositioning(): string {
    return this.position === 'top' ? 'top-0 pt-4' : 'bottom-0 pb-4';
  }
}
