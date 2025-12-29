import { Component, OnInit } from '@angular/core';
import { FireService, Film } from '../fire'; 
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { ModalPage } from '../modal/modal.page'; 

@Component({
  selector: 'app-home',

  templateUrl: 'home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit { 

  filmler: Film[] = [];
  
kullaniciAd: string = ''; 
  kullaniciSoyad: string = '';

  constructor(
    private fire: FireService,private alertController: AlertController,
    private modalController: ModalController,

    private auth: Auth,
    private router: Router
  ) {
  }

  ngOnInit() {
    
  const user = this.auth.currentUser;
    if (!user) {
      this.router.navigateByUrl('/login');
      return; 
    }
    
    this.fire.kullaniciBilgiGetir(user.uid).subscribe((data: any) => {
      if(data) {
        this.kullaniciAd = data.ad;
        this.kullaniciSoyad = data.soyad;
      }
    });

    this.fire.kayitListele().subscribe(sonuc => {
      this.filmler = sonuc;
    console.log("Gelen Filmler:", this.filmler); 
    });
  }

  async ekleModalAc() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { id: null }
    });
    await modal.present();
  }

  async duzenle(film: Film) {
   const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { id: film.id }
    });
    await modal.present();
  }

  async durumDegistir(film: Film, ozellik: 'favori' | 'izlenecek') {
    if (ozellik === 'favori') {
     film.favori = !film.favori;
    } else if (ozellik === 'izlenecek') {
      film.izlenecek = !film.izlenecek;
    }
    await this.fire.kayitGuncelle(film);
  }

  async sil(film: Film) {
    const alert = await this.alertController.create({
      header: 'Sil!',
      message: `${film.ad} silinsin mi?`,
      buttons: [
        { text: 'Vazgeç', role: 'cancel' },
        {
        text: 'Sil',
        role: 'destructive', 
         handler: () => {
           if(film.id) this.fire.kayitSil(film.id);
          }
        }
      ]
    });
    await alert.present();
  }

  async cikis() {
    try {
      await this.fire.cikisYap();
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  }
}