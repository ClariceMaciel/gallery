import { useState, useEffect, FormEvent } from 'react';
import * as C from './App.styles';
import * as Photos from './services/photos';
import { Photo } from './types/Photo';
import { PhotoItem } from './components/PhotoItem';

const App = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false); //processo p mostrar carregamento
    }
    getPhotos();
  }, []);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //previnir comportamento do formulario, n envia os dados

    const formData = new FormData(e.currentTarget); //pegar formulario
    const file = formData.get('image') as File; //form data n sabe que e um arquivo
    
    if(file && file.size > 0) {
      setUploading(true); //faz o envio do arquivo
      let result = await Photos.insert(file); //verificar e enviar, pode ser um error ou uma foto
      setUploading(false); 

      if(result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else { //se n tem erro, ja adiciona na lista
        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }

  }

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          {uploading && "Enviando..."} 

        </C.UploadForm>

        {loading && //quando as fotos estão carregando
          <C.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        }
        
        {!loading && photos.length > 0 && //quando terminar de carregar
          <C.PhotoList>
            {photos.map((item, index)=>(
              <PhotoItem key={index} url={item.url} name={item.name} />            
            ))}
          </C.PhotoList>
        }

        {!loading && photos.length === 0 && //qnd n tiver carregando nem tiver foto
          <C.ScreenWarning>
            <div className="emoji">😕</div>
            <div>Não há fotos cadastradas.</div>
          </C.ScreenWarning>
        }

      </C.Area>
    </C.Container>

  );
}

export default App;