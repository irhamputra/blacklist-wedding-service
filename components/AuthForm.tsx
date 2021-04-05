import { useFormik } from "formik";
import * as React from "react";
import useAuthMutation from "../hooks/useAuthMutation";

const AuthForm: React.FC<{ type: "login" | "register" | undefined }> = ({
  type,
}) => {
  const { mutateAsync } = useAuthMutation(type);

  const { values, handleSubmit, handleChange, status } = useFormik({
    initialValues: {
      email: "",
      password: "",
      ...(type === "register"
        ? {
            displayName: "",
            confirmPassword: "",
          }
        : {}),
    },
    onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
      setSubmitting(true);

      await mutateAsync(values);

      resetForm();
      setStatus("login");
      setSubmitting(false);
    },
  });

  return (
    <>
      <h2>{type.replace(/(^\w|\s\w)/g, (s) => s.toUpperCase())}</h2>
      {status === "login" ? (
        <p>Berhasil login</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row">
            {type === "register" && (
              <div className="col-6">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  value={values.displayName}
                  onChange={handleChange}
                  name="displayName"
                  required
                  type="text"
                  placeholder="Nama anda"
                />
              </div>
            )}

            <div className="col-6">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={values.email}
                onChange={handleChange}
                autoComplete="username"
                name="email"
                required
                type="email"
                placeholder="example@domain.com"
              />
            </div>

            <div className="col-6">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                value={values.password}
                onChange={handleChange}
                name="password"
                autoComplete="current-password"
                minLength={8}
                required
                type="password"
                placeholder="password anda"
              />
            </div>

            {type === "register" && (
              <div className="col-6">
                <label className="form-label">Confirm Password</label>
                <input
                  className="form-control"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                  minLength={8}
                  autoComplete="new-password"
                  required
                  type="password"
                  placeholder="Ulangi password anda"
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-dark mt-3">
            {type.replace(/(^\w|\s\w)/g, (s) => s.toUpperCase())}
          </button>
        </form>
      )}
    </>
  );
};

export default AuthForm;
