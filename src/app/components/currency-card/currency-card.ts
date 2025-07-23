import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard-service';

@Component({
  selector: 'app-currency-card',
  standalone: true,
  templateUrl: './currency-card.html',
  styleUrls: ['./currency-card.scss'],
  imports: [CommonModule, FormsModule]
})
export class CurrencyCardComponent implements OnInit {
  fromCurrency = '';
  toCurrency = '';
  result = '';
  loading = false;
  error?: string;

  currencyCodes: { [key: string]: string } = {};
  currencyOptions: Array<{ code: string, label: string }> = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getCurrencyCodes().subscribe({
      next: res => {
        this.currencyCodes = res.data;
        this.currencyOptions = Object.entries(this.currencyCodes).map(([code, label]) => ({
          code,
          label: `${label}`
        }));
      },
      error: () => {
        this.currencyCodes = {};
        this.currencyOptions = [];
      }
    });
  }

  search() {
    this.error = undefined;
    this.result = '';
    if (!this.fromCurrency || !this.toCurrency) {
      this.error = 'Escolha as duas moedas!';
      return;
    }
    this.loading = true;
    this.dashboardService.getCurrency(this.fromCurrency, this.toCurrency).subscribe({
      next: res => {
        const rate = res.rates ? Object.values(res.rates)[0] : undefined;
        if (rate) {
          this.result = `1 ${this.fromCurrency} = ${rate} ${this.toCurrency}`;
        } else {
          this.result = 'Cotação não encontrada';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao buscar conversão';
        this.loading = false;
      }
    });
  }
}
