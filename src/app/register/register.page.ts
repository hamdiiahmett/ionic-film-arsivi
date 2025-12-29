import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FireService } from '../fire'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {

  ad: string = '';
  soyad: string = '';
  email: string = '';
  password: string = '';
  
  sifreGoster: boolean = false; 

  constructor(
    private auth: Auth, 
    private fire: FireService,
    private router: Router
  ) { }

  async register() {
    if(!this.ad || !this.soyad || !this.email || !this.password) {
      this.fire.presentToast('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      await this.fire.kullaniciDetayKaydet(user.uid, this.ad, this.soyad, this.email);

      this.fire.presentToast('Kayıt Başarılı! Giriş yapabilirsiniz.');
      this.router.navigateByUrl('/login');
      
    } catch (e: any) {
      console.log(e);
      this.fire.presentToast('Hata: ' + e.message);
    }
  }
}