import { Injectable } from '@angular/core';
import { Auth, sendPasswordResetEmail, signOut } from '@angular/fire/auth'; // signOut eklendi
import { 
  Firestore, collection, addDoc, collectionData, 
  doc, deleteDoc, updateDoc, docData, setDoc 
} from '@angular/fire/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

export interface Film {
  id?: string;
  ad: string;
  tur: string;
  yil: number;
  aciklama?: string;   
  puan?: number;       
  favori?: boolean;    
  izlenecek?: boolean; 
  tarih?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FireService {

  constructor(
    private auth: Auth, 
    private firestore: Firestore,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}


  async kullaniciDetayKaydet(uid: string, ad: string, soyad: string, email: string) {
    const ref = doc(this.firestore, `kullanicilar/${uid}`);
    return setDoc(ref, { ad, soyad, email });
  }

  kullaniciBilgiGetir(uid: string) {
    const ref = doc(this.firestore, `kullanicilar/${uid}`);
    return docData(ref);
  }

  async sifreSifirla(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.presentToast('Şifre sıfırlama bağlantısı e-postana gönderildi.');
    } catch (error: any) {
      this.presentToast('Hata: ' + error.message);
    }
  }

  cikisYap() {
    return signOut(this.auth);
  }


  async kayitEkle(veri: Film) {
    const user = this.auth.currentUser;
    if (user) {
      const ref = collection(this.firestore, `kullanicilar/${user.uid}/filmler`);
      return addDoc(ref, veri);
    } else {
      return null;
    }
  }

  kayitListele(): Observable<Film[]> {
    const user = this.auth.currentUser;
    if (user) {
      const ref = collection(this.firestore, `kullanicilar/${user.uid}/filmler`);
      return collectionData(ref, { idField: 'id' }) as Observable<Film[]>;
    } else {
      return new Observable<Film[]>(); 
    }
  }

  kayitGetir(id: string): Observable<Film> {
    const user = this.auth.currentUser;
    if (user) {
      const ref = doc(this.firestore, `kullanicilar/${user.uid}/filmler/${id}`);
      return docData(ref, { idField: 'id' }) as Observable<Film>;
    } else {
      return new Observable<Film>();
    }
  }

  kayitGuncelle(veri: Film) {
    const user = this.auth.currentUser;
    if (user) {
      const ref = doc(this.firestore, `kullanicilar/${user.uid}/filmler/${veri.id}`);
      return updateDoc(ref, { 
        ad: veri.ad, 
        tur: veri.tur, 
        yil: veri.yil,
        aciklama: veri.aciklama || '', 
        puan: veri.puan || 0,
        favori: veri.favori || false,
        izlenecek: veri.izlenecek || false,
        tarih: Math.floor(Date.now() / 1000) 
      });
    } else {
      return null;
    }
  }

  kayitSil(id: string) {
    const user = this.auth.currentUser;
    if (user) {
      const ref = doc(this.firestore, `kullanicilar/${user.uid}/filmler/${id}`);
      return deleteDoc(ref);
    } else {
      return null;
    }
  }


  async presentToast(mesaj: string) {
    const toast = await this.toastController.create({
      message: mesaj,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    toast.present();
  }
}