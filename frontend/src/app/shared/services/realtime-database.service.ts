import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, onChildChanged , Unsubscribe, onDisconnect } from "firebase/database";
import { environment } from 'src/environments/environment';
import { GamerSearching } from '../Interfaces/realtimeDb.interface';

// Inicializar Firebase
const app = initializeApp(environment.firebaseConfig);
export const database = getDatabase(app);

@Injectable({
  providedIn: 'root'
})
export class RealtimeDatabaseService {

  writeData(path: string, data: any) {
    const dbRef = ref(database, path);
    set(dbRef, data)
      .then(() => {
        console.log("Datos guardados correctamente.");
      })
      .catch((error) => {
        console.error("Error al guardar los datos: ", error);
      });
  }

  async getData(path: string): Promise<Record<string, GamerSearching> | null>{
    const dbRef = ref(database, path);
    const snapshot = await get(dbRef)
    if (snapshot) {
      return snapshot.val();
    }else {
      console.log("No hay datos disponibles.");
      return null; // Evita devolver undefined
    }
  }

  connection(userId: string) {
    console.log("Conectandose:", `/users/${userId}`);
    
    const dbRef = ref(database, ".info/connected");
    const userRef = ref(database, `/users/${userId}`);
    onValue(dbRef, (snapshot) => {
      if (snapshot.val() === true) {
        onDisconnect(userRef)
          .remove()
          .then(() => {
            this.writeData(`/users/${userId}`, { isPlaying: false,  })
          })
      }
    })
  }
}
