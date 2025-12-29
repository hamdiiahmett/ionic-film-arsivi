import { Component, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FireService } from '../fire'; 
import { ToastController } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
standalone: false 
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  sifreGoster: boolean = false;
  beniHatirla: boolean = false;

  constructor(
    private auth: Auth, 
    private router: Router,
private fire: FireService 
  ) { }

  ngOnInit() {
    const kayitliEmail = localStorage.getItem('kayitliEmail');
    if(kayitliEmail) {
      this.email = kayitliEmail;
      this.beniHatirla = true; 
    }
  }

  async login() {
    if (!this.email || !this.password) {
       this.fire.presentToast('Lütfen tüm alanları doldurunuz.');
       return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      
      // Beni Hatırla Logic
      if(this.beniHatirla) {
        localStorage.setItem('kayitliEmail', this.email);
      } else {
        localStorage.removeItem('kayitliEmail');
      }

      console.log('Giriş yapan kullanıcı:', userCredential.user.uid);
      this.fire.presentToast('Giriş Başarılı! Yönlendiriliyorsunuz...');
      this.router.navigateByUrl('/home');
      
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found') {
          this.fire.presentToast('Hata: E-posta veya şifre hatalı.');
      } else if (e.code === 'auth/too-many-requests') {
          this.fire.presentToast('Çok fazla deneme yaptınız. Lütfen bekleyin.');
      } else {
          this.fire.presentToast('Bir hata oluştu: ' + e.message);
      }
    }
  }

  async sifremiUnuttum() {
    if(!this.email) {
      this.fire.presentToast('Lütfen şifre sıfırlama bağlantısı için E-Posta adresinizi yazın.');
      return;
    }

    this.fire.presentToast('Şifre sıfırlama bağlantısı gönderildi (Demo).');
  }
}