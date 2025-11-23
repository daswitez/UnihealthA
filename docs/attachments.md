## Attachments – Ficheros adjuntos

- **Base path**: `/attachments`
- **Auth**: requiere `Bearer <token>`

Permite subir ficheros enlazados a entidades (por ejemplo, registros clínicos) y descargarlos posteriormente.

### 1. Subir fichero

- **POST** `/attachments/upload`
- Tipo de contenido: `multipart/form-data`
- Campos:
  - `file`: fichero binario.
  - `ownerTable`: nombre lógico de la tabla propietaria (ej. `"clinical_record"`).
  - `ownerId`: id numérico del recurso propietario.

Ejemplo con `curl`:

```bash
curl -X POST http://localhost:3000/attachments/upload ^
  -H "Authorization: Bearer <TOKEN>" ^
  -F "file=@C:\ruta\informe.pdf" ^
  -F "ownerTable=clinical_record" ^
  -F "ownerId=10"
```

Respuesta:

```json
{
  "id": 1,
  "ownerTable": "clinical_record",
  "ownerId": 10,
  "fileName": "informe.pdf",
  "mimeType": "application/pdf",
  "storagePath": "uploads/abc123...pdf",
  "sizeBytes": 12345,
  "createdById": 2
}
```

Frontend (ejemplo con `FormData`):

```ts
export const uploadAttachment = async (
  token: string,
  file: File,
  ownerTable: string,
  ownerId: number,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ownerTable', ownerTable);
  formData.append('ownerId', String(ownerId));

  const res = await fetch('http://localhost:3000/attachments/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Error subiendo adjunto');
  }

  return res.json();
};
```

### 2. Descargar fichero

- **GET** `/attachments/:id`

Devuelve el binario del fichero con cabeceras:

- `Content-Type`: mime del fichero.
- `Content-Disposition`: `attachment; filename="nombre.ext"`.

Ejemplo:

```bash
curl -L -H "Authorization: Bearer <TOKEN>" ^
  http://localhost:3000/attachments/1 ^
  -o descarga.pdf
```


