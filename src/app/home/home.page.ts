import { Component, ElementRef, ViewChild } from '@angular/core';

enum Operador {
  Soma,
  Subtracao,
  Multiplicacao,
  Divisao,
  InversaoDeSinais,
  Percentual,
  Igual
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private exibicaoDeResultado:boolean = false;
  private operacaoEmMemoria:Operador = Operador.Soma;
  private numeroEmMemoria:number = 0;
  private numeroEmEdicao:number = 0;
  private strNumeroEmEdicao:string = "";
  private numeroDecimalEmEdicao:boolean = false;
  private casasDecimais = 0;
  private historico:string[] = [];

  @ViewChild("divhistorico") divHistorico: ElementRef;

  constructor() {

  }

  onClickBtnIgual() {
    this.calcular(Operador.Igual);
  }

  onClickBtnSomar() {
    this.calcular(Operador.Soma);
  }

  onClickBtnSubtrair() {
    this.calcular(Operador.Subtracao);
  }

  onClickBtnDividir() {
    this.calcular(Operador.Divisao);
  }

  onClickBtnMultiplicar() {
    this.calcular(Operador.Multiplicacao);
  }

  onClickBtnPercentual() {
    this.calcular(Operador.Percentual);
  }

  onClickBtnInversaoDeSinais() {
    this.calcular(Operador.InversaoDeSinais);
  }

  onClickBtnAC() {
    this.operacaoEmMemoria = Operador.Soma;
    this.numeroEmMemoria = 0;
    this.numeroEmEdicao = 0;
    this.numeroDecimalEmEdicao = false;
    this.casasDecimais = 0;
    this.historico = [];
    this.formataExibicao();
  }

  onClickBtnNumero(numero) {
    this.validaExibicaoResultado();

    if (this.numeroDecimalEmEdicao) {
      this.casasDecimais++;
    }
    this.numeroEmEdicao = parseFloat(this.numeroEmEdicao.toString() + (this.casasDecimais == 1 ? '.' : '') + numero.toString());
    this.formataExibicao();
  }

  onClickBtnVirgula() {
    this.validaExibicaoResultado();
    this.numeroDecimalEmEdicao = true;
  }

  calcular(operacao) {
    if (this.numeroEmMemoria && this.operacaoEmMemoria != Operador.Igual) {

      switch (operacao) {
        case Operador.Percentual:
          this.numeroEmEdicao = this.numeroEmEdicao / 100;
          this.casasDecimais = this.casasDecimais + 2;
          this.formataExibicao();
        break;
        case Operador.InversaoDeSinais:
          this.numeroEmEdicao = this.numeroEmEdicao *-1;
          this.formataExibicao();
        break;
      }

      this.adicionarHistorico(this.strNumeroEmEdicao + " =");

      switch (this.operacaoEmMemoria) {
        case Operador.Soma:
          this.numeroEmEdicao = this.numeroEmMemoria + this.numeroEmEdicao;
          break;
        case Operador.Subtracao:
          this.numeroEmEdicao = this.numeroEmMemoria - this.numeroEmEdicao;
          break;
        case Operador.Divisao:
          this.numeroEmEdicao = this.numeroEmMemoria / this.numeroEmEdicao;
          break;
        case Operador.Multiplicacao:
          this.numeroEmEdicao = this.numeroEmMemoria * this.numeroEmEdicao;
          break;
      }
      this.operacaoEmMemoria = Operador.Igual;
      this.exibicaoDeResultado = true;
      this.calculaCasasDecimais();
      this.formataExibicao();
      this.adicionarHistorico(this.strNumeroEmEdicao);
    }

    switch (operacao) {
      case Operador.Soma:
        this.adicionarHistorico(this.strNumeroEmEdicao + " +");
        break;
      case Operador.Subtracao:
        this.adicionarHistorico(this.strNumeroEmEdicao + " -");
        break;
      case Operador.Divisao:
        this.adicionarHistorico(this.strNumeroEmEdicao + " /");
        break;
      case Operador.Multiplicacao:
        this.adicionarHistorico(this.strNumeroEmEdicao + " x");
        break;
      case Operador.Percentual:
        operacao = Operador.Igual;
        break;
      case Operador.InversaoDeSinais:
        operacao = Operador.Igual;
        break;
    }
    this.numeroEmMemoria = this.numeroEmEdicao;
    this.operacaoEmMemoria = operacao;
    if (!this.exibicaoDeResultado) {
      this.resetaEdicao();
    }
  }

  formataExibicao() {
    let numero = this.numeroEmEdicao.toFixed(this.casasDecimais).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    this.strNumeroEmEdicao = numero.join(',');
  }

  calculaCasasDecimais() {
    let numero = (this.numeroEmEdicao).toString().split('.');
    if (numero[1]) {
      this.casasDecimais = numero[1].length;
    }
    else {
      this.casasDecimais = 0;
    }
  }

  validaExibicaoResultado() {
    if (this.exibicaoDeResultado) {
      this.resetaEdicao();
    }
  }

  resetaEdicao() {
    this.exibicaoDeResultado = false;
    this.numeroEmEdicao = 0;
    this.numeroDecimalEmEdicao = false;
    this.casasDecimais = 0;
    this.formataExibicao();
  }

  adicionarHistorico(linha) {
    this.historico.push(linha);
    setTimeout(() => this.divHistorico.nativeElement.scrollTo(0, this.divHistorico.nativeElement.scrollHeight), 1000);
  }
}
