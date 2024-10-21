import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [karyawans, setKaryawans] = useState([]);
  const [newKaryawan, setNewKaryawan] = useState({
    nama_karyawan: "",
    jabatan: "",
    gaji: "",
    tanggal_masuk: "",
  });
  const [editingKaryawan, setEditingKaryawan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // Add state for validation errors

  // Fetch all karyawans on component mount
  useEffect(() => {
    const fetchKaryawans = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/karyawans");
        const data = await response.json();
        setKaryawans(data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchKaryawans();
  }, []);

  // Handle form input changes for both new and editing karyawan
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingKaryawan) {
      setEditingKaryawan({ ...editingKaryawan, [name]: value });
    } else {
      setNewKaryawan({ ...newKaryawan, [name]: value });
    }
  };

  // Create a new karyawan
  const createKaryawan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/karyawans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newKaryawan),
      });
      const data = await response.json();

      if (!response.ok) {
        // If there are validation errors, capture them
        setValidationErrors(data.errors);
        return;
      }

      // If success, add new karyawan and clear form
      setKaryawans([...karyawans, data.data]);
      setNewKaryawan({
        nama_karyawan: "",
        jabatan: "",
        gaji: "",
        tanggal_masuk: "",
      });
      setValidationErrors({}); // Clear validation errors on successful submission
    } catch (error) {
      console.log("Failed to create karyawan", error);
    }
  };

  // Update an existing karyawan
  const updateKaryawan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/karyawans/${editingKaryawan.id_karyawan}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingKaryawan),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        // If there are validation errors, capture them
        setValidationErrors(data.errors);
        return;
      }

      // If success, update the karyawan list
      setKaryawans(
        karyawans.map((karyawan) =>
          karyawan.id_karyawan === editingKaryawan.id_karyawan
            ? data.data
            : karyawan
        )
      );
      setEditingKaryawan(null);
      setValidationErrors({}); // Clear validation errors on successful submission
    } catch (error) {
      console.log("Failed to update karyawan", error);
    }
  };

  // Delete a karyawan
  const deleteKaryawan = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/karyawans/${id}`, {
        method: "DELETE",
      });
      setKaryawans(karyawans.filter((karyawan) => karyawan.id_karyawan !== id));
    } catch (error) {
      console.log("Failed to delete karyawan", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div>
        <h2>{editingKaryawan ? "Edit Karyawan" : "Create Karyawan"}</h2>
        <form onSubmit={editingKaryawan ? updateKaryawan : createKaryawan}>
          <div>
            <input
              type="text"
              name="nama_karyawan"
              placeholder="Nama Karyawan"
              value={
                editingKaryawan
                  ? editingKaryawan.nama_karyawan
                  : newKaryawan.nama_karyawan
              }
              onChange={handleInputChange}
              
            />
            {validationErrors.nama_karyawan && (
              <p style={{ color: "red" }}>
                {validationErrors.nama_karyawan[0]}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="jabatan"
              placeholder="Jabatan"
              value={
                editingKaryawan ? editingKaryawan.jabatan : newKaryawan.jabatan
              }
              onChange={handleInputChange}
              
            />
            {validationErrors.jabatan && (
              <p style={{ color: "red" }}>{validationErrors.jabatan[0]}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              name="gaji"
              placeholder="Gaji"
              value={editingKaryawan ? editingKaryawan.gaji : newKaryawan.gaji}
              onChange={handleInputChange}
              
            />
            {validationErrors.gaji && (
              <p style={{ color: "red" }}>{validationErrors.gaji[0]}</p>
            )}
          </div>
          <div>
            <input
              type="date"
              name="tanggal_masuk"
              placeholder="Tanggal Masuk"
              value={
                editingKaryawan
                  ? editingKaryawan.tanggal_masuk
                  : newKaryawan.tanggal_masuk
              }
              onChange={handleInputChange}
              
            />
            {validationErrors.tanggal_masuk && (
              <p style={{ color: "red" }}>
                {validationErrors.tanggal_masuk[0]}
              </p>
            )}
          </div>
          <button type="submit">
            {editingKaryawan ? "Update Karyawan" : "Create Karyawan"}
          </button>
        </form>

        <h2>Karyawan List</h2>
        <ul>
          {karyawans.map((karyawan) => (
            <li key={karyawan.id_karyawan}>
              {karyawan.nama_karyawan} - {karyawan.jabatan} - {karyawan.gaji} -{" "}
              {karyawan.tanggal_masuk}
              <button onClick={() => setEditingKaryawan(karyawan)}>Edit</button>
              <button onClick={() => deleteKaryawan(karyawan.id_karyawan)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
