import "@reach/dialog/styles.css";

import * as React from "react";
import Fuse from "fuse.js";
import { Dialog } from "@reach/dialog";

import AuthForm from "../components/AuthForm";

import useGetAllDocs from "../hooks/useGetAllDocs";
import ListForm from "../components/ListForm";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { parse } from "cookie";
import axios from "axios";
import { useCookie } from "react-use";
import useBreakpoint from "../hooks/useBreakpoint";
import useLogoutUser from "../hooks/useLogoutUser";

const Home: NextPage<{
  user: InferGetServerSidePropsType<any>;
}> = ({ user }) => {
  const [search, setSearch] = React.useState("");
  const [filteredList, setFilteredList] = React.useState([]);
  const [showDialog, setShowDialog] = React.useState(undefined);
  const { data, isLoading } = useGetAllDocs("Pelaku");
  const [id] = useCookie("id");
  const { mutateAsync: handleLogoutUser } = useLogoutUser();
  const breakpoint = useBreakpoint();

  if (isLoading) return <p>Loading...</p>;

  const searchQuery = (query: string) => {
    const options = {
      includeScore: true,
      keys: ["namaPemilik", "namaService", "alamat"],
    };

    const fuse = new Fuse(data, options);
    setFilteredList(fuse.search(query));
  };

  return (
    <>
      <Dialog
        style={{ width: breakpoint === "tablet" ? "100%" : "50vw" }}
        aria-label="dialog"
        isOpen={Boolean(showDialog)}
        onDismiss={() => setShowDialog(undefined)}
      >
        {["login", "register"].includes(showDialog) ? (
          <AuthForm type={showDialog} onChange={setShowDialog} />
        ) : null}

        {showDialog === "addList" ? (
          <ListForm email={user?.["email"] ?? ""} onAddList={setShowDialog} />
        ) : null}
      </Dialog>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-end mt-3 align-items-center">
              {user?.["email"] ? (
                <>
                  <p className="m-0 me-3">Hello, {user["email"]}</p>
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={async () => {
                      await handleLogoutUser(id);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowDialog("login")}
                    className="btn btn-dark"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowDialog("register")}
                    className="btn btn-outline-dark ms-3"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="col-12 mt-5">
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <h1>Blacklist Wedding Service</h1>
              </div>

              <div className="col-sm-12 col-md-6">
                <h5>
                  List para pelaku penipu atau oknum yang merusak momen saat
                  pernikahan. <br /> Mari bantu untuk isi list direktori para
                  penipu
                </h5>
              </div>
            </div>
          </div>

          <div className="col-12 my-5">
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <div
                  className={`input-group ${
                    breakpoint === "tablet" ? "w-100" : "w-50"
                  }`}
                >
                  <input
                    className="form-control"
                    placeholder="Cari Pelaku"
                    name="search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      searchQuery(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div
                className={`col-sm-12 col-md-6 text-end ${
                  breakpoint === "tablet" ? "mt-3" : ""
                }`}
              >
                {user?.["email"] ? (
                  <>
                    <small>Tidak menemukan listnya?</small>

                    <button
                      type="button"
                      onClick={() => setShowDialog("addList")}
                      className="btn btn-dark ms-3"
                    >
                      Tambahkan
                    </button>
                  </>
                ) : (
                  <small>Login terlebih dahulu untuk menambahkan list</small>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 table-responsive mb-5">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Nama Organizer</th>
                  <th scope="col">Nama Pelaku</th>
                  <th scope="col">Kejahatan</th>
                  <th scope="col">Alamat / Lokasi</th>
                  <th scope="col">HP</th>
                  <th scope="col">Sumber</th>
                </tr>
              </thead>

              <tbody>
                {search.length <= 0 &&
                  data?.map((v) => {
                    return (
                      <tr key={v.handphone}>
                        <td>{v.namaService}</td>
                        <td>{v.namaPemilik}</td>
                        <td>{v.kejahatan}</td>
                        <td>{v.alamat}</td>
                        <td>{v.handphone}</td>
                        <td>
                          <a target="_blank" href={v.source}>
                            Link
                          </a>
                        </td>
                      </tr>
                    );
                  })}

                {search.length > 0 &&
                  filteredList?.map((v) => {
                    return (
                      <tr key={v.item.handphone}>
                        <td>{v.item.namaService}</td>
                        <td>{v.item.namaPemilik}</td>
                        <td>{v.item.kejahatan}</td>
                        <td>{v.item.alamat}</td>
                        <td>{v.item.handphone}</td>
                        <td>
                          <a target="_blank" href={v.item.source}>
                            Link
                          </a>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = parse(req.headers.cookie || "");

  if (!cookie["id"]) return { props: {} };

  const { id } = cookie;

  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://blacklist-wedding-service.vercel.app/";

  const { data } = await axios.get(`${BASE_URL}/api/v1/user`, {
    headers: {
      authorization: `Bearer ${id}`,
    },
  });

  const [user] = data.users;

  return {
    props: {
      user,
    },
  };
};
