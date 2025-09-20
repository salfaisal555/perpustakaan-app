import React, { useState, useEffect, useCallback, useMemo } from "react";

// === Konfigurasi & Komponen Ikon ===
const API_BASE_URL = "http://localhost/perpustakaan/api";
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);
const MembersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const BooksIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);
const BorrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h6.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2"
    />
  </svg>
);
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

// === Komponen-Komponen UI Umum ===
const Sidebar = React.memo(
  ({
    currentPage,
    setCurrentPage,
    setSearchTerm,
    borrowCount,
    isOpen,
    setIsOpen,
  }) => (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`fixed lg:relative inset-y-0 left-0 w-64 bg-white rounded-r-xl lg:rounded-xl shadow-lg flex flex-col transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">UrLibrary</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="flex-grow p-4">
          <ul>
            {[
              { name: "Dashboard", icon: <DashboardIcon /> },
              { name: "Data Anggota", icon: <MembersIcon /> },
              { name: "Data Buku", icon: <BooksIcon /> },
              { name: "Peminjaman", icon: <BorrowIcon /> },
            ].map((item) => (
              <li key={item.name} className="mb-2">
                <button
                  onClick={() => {
                    setCurrentPage(item.name);
                    setSearchTerm("");
                    setIsOpen(false); // Close sidebar on mobile after navigation
                  }}
                  className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-lg text-left font-semibold transition-all duration-200 ${
                    currentPage === item.name
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.name === "Peminjaman" && borrowCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {borrowCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
);

const PageHeader = React.memo(
  ({ title, buttonText, onButtonClick, onMenuClick }) => (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-indigo-600 p-2 -ml-2"
        >
          <MenuIcon />
        </button>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
          {title}
        </h2>
      </div>
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
        >
          {" "}
          {buttonText}{" "}
        </button>
      )}
    </div>
  )
);

const SearchBar = React.memo(({ searchTerm, setSearchTerm }) => (
  <div className="relative mb-6">
    <input
      type="text"
      placeholder="Cari..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
    />
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {" "}
      <SearchIcon />{" "}
    </div>
  </div>
));

const Notification = React.memo(({ message, type, onDismiss }) => {
  if (!message) return null;
  const typeClasses = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white flex items-center z-[100] transition-all duration-300 transform ${
        message ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {" "}
      <span>{message}</span>{" "}
      <button
        onClick={onDismiss}
        className="ml-4 p-1 rounded-full hover:bg-black/20"
      >
        <CloseIcon />
      </button>{" "}
    </div>
  );
});

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    {" "}
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>{" "}
  </div>
);

const FormInput = (props) => (
  <div className="mb-4">
    {" "}
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      {props.label}
    </label>{" "}
    <input
      {...props}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
    />{" "}
  </div>
);
const FormSelect = (props) => (
  <div className="mb-4">
    {" "}
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      {props.label}
    </label>{" "}
    <select
      {...props}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow bg-white"
    >
      {props.children}
    </select>{" "}
  </div>
);
const ModalActions = ({
  onCancel,
  submitText = "Submit",
  submitColor = "bg-indigo-600",
  hoverColor = "hover:bg-indigo-700",
}) => (
  <div className="flex justify-end gap-4 mt-8">
    {" "}
    <button
      type="button"
      onClick={onCancel}
      className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-semibold"
    >
      Batal
    </button>{" "}
    <button
      type="submit"
      className={`px-6 py-2 rounded-lg text-white ${submitColor} ${hoverColor} transition-colors font-semibold shadow-md hover:shadow-lg`}
    >
      {submitText}
    </button>{" "}
  </div>
);

// === Komponen Utama Aplikasi ===
function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [data, setData] = useState({ anggota: [], buku: [], peminjaman: [] });
  const [dashboardStats, setDashboardStats] = useState({
    anggota: 0,
    buku: 0,
    dipinjam: 0,
  });
  const [modal, setModal] = useState({ type: null, data: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  }, []);

  const refreshAllData = useCallback(async () => {
    try {
      const endpoints = {
        anggota: `${API_BASE_URL}/anggota.php`,
        buku: `${API_BASE_URL}/buku.php`,
        peminjaman: `${API_BASE_URL}/peminjaman.php`,
        dashboard: `${API_BASE_URL}/dashboard.php`,
      };
      const responses = await Promise.all(
        Object.values(endpoints).map((url) => fetch(url))
      );
      for (const res of responses) {
        if (!res.ok) {
          const url = new URL(res.url);
          const endpointName = Object.keys(endpoints).find((key) =>
            url.href.includes(endpoints[key])
          );
          throw new Error(`Gagal memuat data dari ${endpointName}.php.`);
        }
      }
      const [anggotaData, bukuData, peminjamanData, dashboardData] =
        await Promise.all(responses.map((res) => res.json()));
      setData({
        anggota: anggotaData,
        buku: bukuData,
        peminjaman: peminjamanData,
      });
      setDashboardStats({
        anggota: dashboardData.total_anggota,
        buku: dashboardData.total_buku,
        dipinjam: dashboardData.total_dipinjam,
      });
    } catch (error) {
      showNotification(error.message, "error");
    }
  }, [showNotification]);

  useEffect(() => {
    setIsLoading(true);
    refreshAllData().finally(() => setIsLoading(false));
  }, [refreshAllData]);

  const handleApiCall = async (url, options, successMessage) => {
    try {
      const response = await fetch(url, options);
      const text = await response.text();
      const result = text ? JSON.parse(text) : {};
      if (!response.ok)
        throw new Error(result.message || "Terjadi kesalahan pada server.");
      showNotification(successMessage, "success");
      await refreshAllData();
      closeModal();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const openModal = (type, itemData = null) =>
    setModal({ type, data: itemData });
  const closeModal = () => setModal({ type: null, data: null });

  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) return data;
    return {
      anggota: data.anggota.filter((a) =>
        a.nama_anggota.toLowerCase().includes(lowerSearchTerm)
      ),
      buku: data.buku.filter((b) =>
        b.judul.toLowerCase().includes(lowerSearchTerm)
      ),
      peminjaman: data.peminjaman.filter(
        (p) =>
          (p.nama_anggota &&
            p.nama_anggota.toLowerCase().includes(lowerSearchTerm)) ||
          (p.judul && p.judul.toLowerCase().includes(lowerSearchTerm))
      ),
    };
  }, [data, searchTerm]);

  return (
    <div className="h-screen bg-slate-100 font-sans flex flex-col lg:flex-row">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSearchTerm={setSearchTerm}
        borrowCount={dashboardStats.dipinjam}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white lg:rounded-xl shadow-lg m-0 lg:m-4 p-6 lg:p-8 overflow-y-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <PageHeader
                title={currentPage}
                onMenuClick={() => setIsSidebarOpen(true)}
                buttonText={
                  currentPage === "Data Anggota"
                    ? "Tambah Anggota"
                    : currentPage === "Data Buku"
                    ? "Tambah Buku"
                    : currentPage === "Peminjaman"
                    ? "Pinjam Buku"
                    : null
                }
                onButtonClick={() =>
                  currentPage === "Data Anggota"
                    ? openModal("addAnggota")
                    : currentPage === "Data Buku"
                    ? openModal("addBuku")
                    : openModal("addPeminjaman")
                }
              />
              {currentPage !== "Dashboard" && (
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              )}

              {currentPage === "Dashboard" && (
                <DashboardPage
                  stats={dashboardStats}
                  recentPeminjaman={data.peminjaman.slice(0, 5)}
                />
              )}
              {currentPage === "Data Anggota" && (
                <AnggotaPage
                  filteredData={filteredData}
                  openModal={openModal}
                />
              )}
              {currentPage === "Data Buku" && (
                <BukuPage filteredData={filteredData} openModal={openModal} />
              )}
              {currentPage === "Peminjaman" && (
                <PeminjamanPage
                  filteredData={filteredData}
                  handleApiCall={handleApiCall}
                />
              )}
            </>
          )}
        </main>
      </div>
      <AppModal
        modal={modal}
        closeModal={closeModal}
        handleApiCall={handleApiCall}
        data={data}
      />
      <Notification
        message={notification.message}
        type={notification.type}
        onDismiss={() => setNotification({ message: "", type: "" })}
      />
    </div>
  );
}

// === Halaman-Halaman (Pages) ===
const DashboardPage = ({ stats, recentPeminjaman }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {[
        { title: "Jumlah Anggota", value: stats.anggota, color: "bg-blue-500" },
        { title: "Jumlah Buku", value: stats.buku, color: "bg-green-500" },
        {
          title: "Buku yang Dipinjam",
          value: stats.dipinjam,
          color: "bg-orange-500",
        },
      ].map((item) => (
        <div
          key={item.title}
          className={`${item.color} text-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl`}
        >
          {" "}
          <h3 className="text-lg font-semibold">{item.title}</h3>{" "}
          <p className="text-4xl font-bold mt-2">{item.value}</p>{" "}
        </div>
      ))}
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-4">
      Data Peminjaman Terbaru
    </h3>
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full table-auto min-w-[600px]">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
              Nama Peminjam
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
              Judul Buku
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
              Tanggal Pinjam
            </th>
          </tr>
        </thead>
        <tbody>
          {recentPeminjaman.map((p) => (
            <tr
              key={p.id_peminjaman}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="p-4 text-gray-700">
                {p.nama_anggota || "(Data Dihapus)"}
              </td>
              <td className="p-4 text-gray-700">
                {p.judul || "(Data Dihapus)"}
              </td>
              <td className="p-4 text-gray-700">
                {new Date(p.tgl_pinjam).toLocaleDateString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const AnggotaPage = ({ filteredData, openModal }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="w-full table-auto min-w-[600px]">
      <thead className="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Id
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Nama
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            No HP
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Alamat
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.anggota.map((a) => (
          <tr
            key={a.id_anggota}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <td className="p-4 text-gray-700">{a.id_anggota}</td>
            <td className="p-4 text-gray-700">{a.nama_anggota}</td>
            <td className="p-4 text-gray-700">{a.no_hp}</td>
            <td className="p-4 text-gray-700">{a.alamat}</td>
            <td className="p-4 text-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={() => openModal("editAnggota", a)}
                  className="px-4 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => openModal("deleteAnggota", a)}
                  className="px-4 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BukuPage = ({ filteredData, openModal }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="w-full table-auto min-w-[600px]">
      <thead className="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Id
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Judul Buku
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Pengarang
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.buku.map((b) => (
          <tr
            key={b.id_buku}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <td className="p-4 text-gray-700">{b.id_buku}</td>
            <td className="p-4 text-gray-700">{b.judul}</td>
            <td className="p-4 text-gray-700">{b.pengarang}</td>
            <td className="p-4 text-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={() => openModal("editBuku", b)}
                  className="px-4 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => openModal("deleteBuku", b)}
                  className="px-4 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PeminjamanPage = ({ filteredData, handleApiCall }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="w-full table-auto min-w-[600px]">
      <thead className="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Id
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Nama
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Judul Buku
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Tgl Pinjam
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Tgl Kembali
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Status
          </th>
          <th className="p-4 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.peminjaman.map((p) => (
          <tr
            key={p.id_peminjaman}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <td className="p-4 text-gray-700">{p.id_peminjaman}</td>
            <td className="p-4 text-gray-700">
              {p.nama_anggota || "(Data Dihapus)"}
            </td>
            <td className="p-4 text-gray-700">{p.judul || "(Data Dihapus)"}</td>
            <td className="p-4 text-gray-700">
              {new Date(p.tgl_pinjam).toLocaleDateString("id-ID")}
            </td>
            <td className="p-4 text-gray-700">
              {p.tgl_kembali
                ? new Date(p.tgl_kembali).toLocaleDateString("id-ID")
                : "-"}
            </td>
            <td className="p-4 text-gray-700">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  p.status === "Dipinjam"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {p.status}
              </span>
            </td>
            <td className="p-4 text-gray-700">
              {p.status === "Dipinjam" && (
                <button
                  onClick={() =>
                    handleApiCall(
                      `${API_BASE_URL}/peminjaman.php?id=${p.id_peminjaman}`,
                      { method: "PUT" },
                      "Buku berhasil dikembalikan"
                    )
                  }
                  className="px-4 py-1 text-sm text-white bg-teal-500 rounded hover:bg-teal-600 transition-colors"
                >
                  Kembalikan
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// === FORM COMPONENTS (Dipisah untuk state management lokal) ===
const AnggotaForm = ({ initialData, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState(
    initialData || { id_anggota: "", nama_anggota: "", no_hp: "", alamat: "" }
  );
  const isEdit = !!initialData;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState, isEdit);
  };
  return (
    <form onSubmit={handleSubmit}>
      {" "}
      <FormInput
        label="Id Anggota"
        name="id_anggota"
        value={formState.id_anggota}
        onChange={handleChange}
        required
        disabled={isEdit}
      />{" "}
      <FormInput
        label="Nama"
        name="nama_anggota"
        value={formState.nama_anggota}
        onChange={handleChange}
        required
      />{" "}
      <FormInput
        label="No HP"
        name="no_hp"
        value={formState.no_hp}
        onChange={handleChange}
        required
      />{" "}
      <FormInput
        label="Alamat"
        name="alamat"
        value={formState.alamat}
        onChange={handleChange}
        required
      />{" "}
      <ModalActions onCancel={onCancel} />{" "}
    </form>
  );
};

const BukuForm = ({ initialData, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState(
    initialData || { id_buku: "", judul: "", pengarang: "" }
  );
  const isEdit = !!initialData;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState, isEdit);
  };
  return (
    <form onSubmit={handleSubmit}>
      {" "}
      <FormInput
        label="Id Buku"
        name="id_buku"
        value={formState.id_buku}
        onChange={handleChange}
        required
        disabled={isEdit}
      />{" "}
      <FormInput
        label="Judul Buku"
        name="judul"
        value={formState.judul}
        onChange={handleChange}
        required
      />{" "}
      <FormInput
        label="Pengarang"
        name="pengarang"
        value={formState.pengarang}
        onChange={handleChange}
        required
      />{" "}
      <ModalActions onCancel={onCancel} />{" "}
    </form>
  );
};

const PeminjamanForm = ({ data, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState({
    id_peminjaman: "",
    id_anggota: "",
    nama_anggota: "",
    id_buku: "",
    judul: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => {
      if (name === "id_anggota")
        return {
          ...prev,
          id_anggota: value,
          nama_anggota:
            data.anggota.find((a) => a.id_anggota === value)?.nama_anggota ||
            "",
        };
      if (name === "id_buku")
        return {
          ...prev,
          id_buku: value,
          judul: data.buku.find((b) => b.id_buku === value)?.judul || "",
        };
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };
  return (
    <form onSubmit={handleSubmit}>
      {" "}
      <FormInput
        label="Id Peminjaman"
        name="id_peminjaman"
        value={formState.id_peminjaman}
        onChange={handleChange}
        required
      />{" "}
      <FormSelect
        label="Id Anggota"
        name="id_anggota"
        value={formState.id_anggota}
        onChange={handleChange}
        required
      >
        {" "}
        <option value="">Pilih Anggota</option>{" "}
        {data.anggota.map((a) => (
          <option key={a.id_anggota} value={a.id_anggota}>
            {a.id_anggota} - {a.nama_anggota}
          </option>
        ))}{" "}
      </FormSelect>{" "}
      <FormInput
        label="Nama"
        name="nama_anggota"
        value={formState.nama_anggota}
        readOnly
      />{" "}
      <FormSelect
        label="Id Buku"
        name="id_buku"
        value={formState.id_buku}
        onChange={handleChange}
        required
      >
        {" "}
        <option value="">Pilih Buku</option>{" "}
        {data.buku.map((b) => (
          <option key={b.id_buku} value={b.id_buku}>
            {b.id_buku} - {b.judul}
          </option>
        ))}{" "}
      </FormSelect>{" "}
      <FormInput
        label="Judul Buku"
        name="judul"
        value={formState.judul}
        readOnly
      />{" "}
      <ModalActions
        onCancel={onCancel}
        submitText="Pinjam"
        submitColor="bg-teal-500"
        hoverColor="hover:bg-teal-600"
      />{" "}
    </form>
  );
};

// === Komponen Modal Terpusat (Shell) ===
const AppModal = ({ modal, closeModal, handleApiCall, data }) => {
  if (!modal.type) return null;
  const handleSubmitAnggota = (formState, isEdit) =>
    handleApiCall(
      isEdit
        ? `${API_BASE_URL}/anggota.php?id=${formState.id_anggota}`
        : `${API_BASE_URL}/anggota.php`,
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      },
      isEdit
        ? "Data anggota berhasil diubah"
        : "Anggota baru berhasil ditambahkan"
    );
  const handleDeleteAnggota = () =>
    handleApiCall(
      `${API_BASE_URL}/anggota.php?id=${modal.data.id_anggota}`,
      { method: "DELETE" },
      "Data anggota berhasil dihapus"
    );
  const handleSubmitBuku = (formState, isEdit) =>
    handleApiCall(
      isEdit
        ? `${API_BASE_URL}/buku.php?id=${formState.id_buku}`
        : `${API_BASE_URL}/buku.php`,
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      },
      isEdit ? "Data buku berhasil diubah" : "Buku baru berhasil ditambahkan"
    );
  const handleDeleteBuku = () =>
    handleApiCall(
      `${API_BASE_URL}/buku.php?id=${modal.data.id_buku}`,
      { method: "DELETE" },
      "Data buku berhasil dihapus"
    );
  const handleSubmitPeminjaman = (formState) =>
    handleApiCall(
      `${API_BASE_URL}/peminjaman.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      },
      "Buku berhasil dipinjam"
    );

  let title = "";
  let content = null;

  switch (modal.type) {
    case "addAnggota":
    case "editAnggota":
      title =
        modal.type === "addAnggota" ? "Tambah Anggota" : "Edit Data Anggota";
      content = (
        <AnggotaForm
          initialData={modal.data}
          onSubmit={handleSubmitAnggota}
          onCancel={closeModal}
        />
      );
      break;
    case "deleteAnggota":
      title = "Hapus Anggota";
      content = (
        <div>
          {" "}
          <p className="text-gray-600">
            Yakin ingin menghapus data anggota:{" "}
            <strong>{modal.data.nama_anggota}</strong>?
          </p>{" "}
          <div className="flex justify-end gap-4 mt-8">
            {" "}
            <button
              onClick={closeModal}
              className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-semibold"
            >
              Batal
            </button>{" "}
            <button
              onClick={handleDeleteAnggota}
              className="px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              Hapus
            </button>{" "}
          </div>{" "}
        </div>
      );
      break;
    case "addBuku":
    case "editBuku":
      title = modal.type === "addBuku" ? "Tambah Buku" : "Edit Data Buku";
      content = (
        <BukuForm
          initialData={modal.data}
          onSubmit={handleSubmitBuku}
          onCancel={closeModal}
        />
      );
      break;
    case "deleteBuku":
      title = "Hapus Buku";
      content = (
        <div>
          {" "}
          <p className="text-gray-600">
            Yakin ingin menghapus buku: <strong>{modal.data.judul}</strong>?
          </p>{" "}
          <div className="flex justify-end gap-4 mt-8">
            {" "}
            <button
              onClick={closeModal}
              className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-semibold"
            >
              Batal
            </button>{" "}
            <button
              onClick={handleDeleteBuku}
              className="px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              Hapus
            </button>{" "}
          </div>{" "}
        </div>
      );
      break;
    case "addPeminjaman":
      title = "Pinjam Buku";
      content = (
        <PeminjamanForm
          data={data}
          onSubmit={handleSubmitPeminjaman}
          onCancel={closeModal}
        />
      );
      break;
    default:
      return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 lg:p-8 m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          {" "}
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>{" "}
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>{" "}
        </div>
        {content}
      </div>
    </div>
  );
};

export default App;
