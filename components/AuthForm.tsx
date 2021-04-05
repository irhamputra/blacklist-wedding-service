import { useFormik } from "formik";
import * as React from "react";
import useAuthMutation from "../hooks/useAuthMutation";
import { useCookie } from "react-use";
import { useRouter } from "next/router";
import useBreakpoint from "../hooks/useBreakpoint";

const AuthForm: React.FC<{
  type: "login" | "register" | undefined;
  onChange: React.Dispatch<any>;
}> = ({ type, onChange }) => {
  const [id] = useCookie("id");
  const { reload } = useRouter();
  const { mutateAsync } = useAuthMutation(type);
  const breakpoint = useBreakpoint();

  const { values, handleSubmit, handleChange, isSubmitting } = useFormik({
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
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      await mutateAsync(values);
      onChange(undefined);
      resetForm();
      reload();
      setSubmitting(false);
    },
  });

  if (id) return <p>Berhasil login</p>;

  return (
    <>
      <h2>{type.replace(/(^\w|\s\w)/g, (s) => s.toUpperCase())}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {type === "register" && (
            <div className={breakpoint === "tablet" ? "col-12" : "col-6"}>
              <label className="form-label">Full Name</label>
              <input
                disabled={isSubmitting}
                className="form-control"
                value={values.displayName}
                onChange={handleChange}
                name="displayName"
                required
                type="text"
                placeholder="Nama Anda"
              />
            </div>
          )}

          <div className={breakpoint === "tablet" ? "col-12" : "col-6"}>
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={values.email}
              disabled={isSubmitting}
              onChange={handleChange}
              autoComplete="username"
              name="email"
              required
              type="email"
              placeholder="example@domain.com"
            />
          </div>

          <div className={breakpoint === "tablet" ? "col-12" : "col-6"}>
            <label className="form-label">Password</label>
            <input
              className="form-control"
              value={values.password}
              disabled={isSubmitting}
              onChange={handleChange}
              name="password"
              autoComplete="current-password"
              minLength={8}
              required
              type="password"
              placeholder="Password Anda"
            />
          </div>

          {type === "register" && (
            <div className={breakpoint === "tablet" ? "col-12" : "col-6"}>
              <label className="form-label">Confirm Password</label>
              <input
                className="form-control"
                value={values.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                disabled={isSubmitting}
                minLength={8}
                autoComplete="new-password"
                required
                type="password"
                placeholder="Ulangi password anda"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-dark mt-3"
        >
          {isSubmitting
            ? "Mohon tunggu... "
            : type.replace(/(^\w|\s\w)/g, (s) => s.toUpperCase())}
        </button>
      </form>
    </>
  );
};

export default AuthForm;
