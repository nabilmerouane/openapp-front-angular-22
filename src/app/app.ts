import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    // console.log(typeof 12);
    // console.log(typeof null);
    // console.log(typeof undefined);
    // console.log(' ************** ');
    // console.log(Boolean(''));
    // console.log(Boolean(' '));
    // console.log(Boolean([]));
    // console.log(' \t\n');
    // console.log(' ************** ');
    // console.log(0.1 + 0.2 + 0.3);
    // console.log(0.1 + (0.2 + 0.3));
    // console.log(0.1 + 0.2 + 0.3 === 0.1 + (0.2 + 0.3));
    // console.log(0.3 - 0.2);
    // console.log(0.1 + 0.2 == 0.3);
    // console.log(0.1 + 0.2 === 0.3);
    // console.log(0.1 + 0.2 + 0.3);
    // console.log(' ************** ');
    // console.log('10' + -'2');
    // console.log(' ************** ');
    // this.compte(5);
    // this.compteARebours(5);
    // console.log(this.puissance(2, -4));
    // console.log(this.nbChiffres(2455654));
    // console.log(Math.floor(245 / 10));
    console.log(this.estPalindrome2('caramarac') ? 'est un palindrome' : "n'est pas un palindrome");
    // console.log(this.palindrome3('A man, a plan, a canal: Panama'));
  }

  private estPalindrome(mot: string): boolean {
    if (mot.length <= 1) {
      return true;
    }

    if (mot[0] !== mot[mot.length - 1]) {
      return false;
    }

    return this.estPalindrome(mot.slice(1, -1));
  }

  private palindrome3(mot: string): string {
    const motLC = mot.toLowerCase();
    const motNettoye = motLC.replace(/[^a-z0-9]/g, '');

    return motNettoye;
  }

  private estPalindrome2(mot: string): boolean {
    let i = 0;
    let j = mot.length - 1;

    while (i < j) {
      if (mot[i] !== mot[j]) {
        return false;
      }
      i++;
      j--;
    }

    return true;
  }

  // private compte(n: number): void {
  //   // return n > 0 ? n + this.compte(n - 1) : 0;
  //   if (n === 0) {
  //     // return 0;
  //     return;
  //   }
  //   this.compte(n - 1);
  //   console.log(n);
  //   // return n + this.compte(n - 1);
  // }

  // private compteARebours(n: number): void {
  //   if (n === 0) {
  //     return;
  //   }
  //   this.compteARebours(n - 1);
  //   console.log(n);
  // }

  // // private puissance(x: number, n: number): number {
  // //   return n === 0 ? 1 : x * this.puissance(x, n - 1);
  // // }

  // private puissance(x: number, n: number): number {
  //   if (n < 0) {
  //     return 1 / this.puissance(x, -n);
  //   }

  //   if (n === 0) {
  //     return 1;
  //   }
  //   return x * this.puissance(x, n - 1);
  // }

  // private nbChiffres(n: number): number {
  //   if (n < 10) {
  //     return 1;
  //   }
  //   return 1 + this.nbChiffres(Math.floor(n / 10));
  // }

  // private somme(n: number): number {
  //   if (n <= 0) {
  //     return 0;
  //   }
  //   return n + this.somme(n - 1);
  // }
}
