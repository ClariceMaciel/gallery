import { Photo } from '../types/Photo';
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes} from 'firebase/storage';
import { v4 as createId } from 'uuid'; //v4 gera nomes

export const getAll = async () => { //async esperar, p tudo que tiver uma requisição externa que precisa esperar
    let list: Photo[] = [];

    const imagesFolder = ref(storage, "images");
    const photoList = await listAll(imagesFolder);

    for(let i in photoList.items) {
        let photoUrl = await getDownloadURL(photoList.items[i]);
        
        list.push({
            name: photoList.items[i].name,
            url: photoUrl
        });
    }

    return list; //função que lê as fotos
}

//função que envia as fotos

export const insert = async (file: File) => { 
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) { //tipos de arquivos q aceita
        
        let randomName = createId(); //nome aleatorio
        let newFile = ref(storage, `images/${randomName}`); //criando referencia de arquivo

        let upload = await uploadBytes(newFile, file); //mandando arquivo
        let photoUrl = await getDownloadURL(upload.ref);

        return {
            name: upload.ref.name,
            url: photoUrl
        } as Photo;

    } else {
        return new Error('Tipo de arquivo não permitido.');
    }
}