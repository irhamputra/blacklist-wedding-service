import * as React from "react";
import { useFormik } from "formik";
import useCreateDocs from "../hooks/useCreateDocs";
import { v4 } from "uuid";

const capitalize = (s: string) =>
  s.replace(/(^\w|\s\w)/g, (s) => s.toUpperCase());

const ListForm: React.FC<{ onAddList: React.Dispatch<any>; email: string }> = ({
  onAddList,
  email,
}) => {
  const { mutateAsync: createList } = useCreateDocs("Pelaku");

  const { values, handleChange, handleSubmit, isSubmitting } = useFormik({
    initialValues: {
      alamat: "",
      handphone: "",
      kejahatan: "",
      namaPemilik: "",
      namaService: "",
      source: "",
    },
    onSubmit: async (value, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      await createList({ id: v4(), email, ...value });
      onAddList(undefined);
      resetForm();
      setSubmitting(false);
    },
  });
  return (
    <>
      <h4>Form Pelaku</h4>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Nama Organizer</label>
        <input
          disabled={isSubmitting}
          name="namaService"
          className="form-control"
          value={capitalize(values.namaService)}
          onChange={handleChange}
          placeholder="Nama Organizer Pemilik Pelaku"
          required
        />

        <label className="form-label">Nama Pelaku</label>
        <input
          name="namaPemilik"
          disabled={isSubmitting}
          className="form-control"
          value={capitalize(values.namaPemilik)}
          onChange={handleChange}
          placeholder="Nama Pelaku"
          required
        />

        <label className="form-label">Hal Penipuan yang Dilakukan</label>
        <input
          name="kejahatan"
          className="form-control"
          disabled={isSubmitting}
          value={capitalize(values.kejahatan)}
          onChange={handleChange}
          placeholder="Masukkan hal penipuan yang dilakukan oleh pelaku"
        />

        <label className="form-label">Alamat / Lokasi</label>
        <input
          name="alamat"
          className="form-control"
          disabled={isSubmitting}
          value={capitalize(values.alamat)}
          onChange={handleChange}
          placeholder="Masukan alamat pelaku (jika tidak tahu gunakan '-')"
        />

        <label className="form-label">No Handphone</label>
        <input
          name="handphone"
          disabled={isSubmitting}
          className="form-control"
          value={capitalize(values.handphone)}
          onChange={handleChange}
          required
          placeholder="Masukkan nomor handphone pelaku"
        />

        <label className="form-label">Sumber</label>
        <input
          name="source"
          className="form-control"
          disabled={isSubmitting}
          value={values.source}
          onChange={handleChange}
          required
          placeholder="Masukkan link share dari sosial media"
        />

        <button
          className="btn btn-dark mt-3"
          disabled={isSubmitting}
          type="submit"
        >
          Submit Pelaku
        </button>
      </form>
    </>
  );
};

export default ListForm;
