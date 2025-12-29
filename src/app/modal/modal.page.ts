import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FireService, Film } from '../fire';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
  standalone: false
})
export class ModalPage implements OnInit {

  @Input() id: string = ''; 
  
  film: Film = { 
    ad: '', 
    tur: '', 
    yil: 2024,
    aciklama: '', 
    puan: 0, 
    favori: false, 
    izlenecek: false 
  }; 

  yildizlar: number[] = [1, 2, 3, 4, 5];

  constructor(
    private fire: FireService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if (this.id) {
      this.fire.kayitGetir(this.id).subscribe(sonuc => {
        this.film = { 
          ...this.film, 
          ...sonuc      
        };
      });
    }
  }

  kapat() {
    this.modalController.dismiss();
  }

  puanVer(yildizSayisi: number) {
    this.film.puan = yildizSayisi;
  }

  async kaydet() {
    if (!this.film.ad || !this.film.tur) {
      this.fire.presentToast('Lütfen Film Adı ve Türünü giriniz.');
      return;
    }

    try {
      if (this.id) {
        this.film.id = this.id;
        await this.fire.kayitGuncelle(this.film);
        this.fire.presentToast('Film başarıyla güncellendi! 🎉');
      } else {
        this.film.tarih = Math.floor(Date.now() / 1000); 
        await this.fire.kayitEkle(this.film);
        this.fire.presentToast('Yeni film listene eklendi! 🎬');
      }

      this.modalController.dismiss();

    } catch (error) {
      console.error(error);
      this.fire.presentToast('Bir hata oluştu, tekrar deneyin.');
    }
  }
}