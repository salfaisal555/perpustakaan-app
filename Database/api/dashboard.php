<?php
error_reporting(0);
ini_set('display_errors', 0);

include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Koneksi database gagal: ' . $conn->connect_error]);
    exit();
}

$stats = [
    'total_anggota' => 0,
    'total_buku' => 0,
    'total_dipinjam' => 0
];

// Get total anggota
$result_anggota = $conn->query("SELECT COUNT(*) as total FROM anggota");
if ($result_anggota) {
    $stats['total_anggota'] = (int) $result_anggota->fetch_assoc()['total'];
}

// Get total buku
$result_buku = $conn->query("SELECT COUNT(*) as total FROM buku");
if ($result_buku) {
    $stats['total_buku'] = (int) $result_buku->fetch_assoc()['total'];
}

// Get total buku yang dipinjam
$result_dipinjam = $conn->query("SELECT COUNT(*) as total FROM peminjaman WHERE status = 'Dipinjam'");
if ($result_dipinjam) {
    $stats['total_dipinjam'] = (int) $result_dipinjam->fetch_assoc()['total'];
} else {
    // Jika query gagal (misal: kolom status belum ada), kirim 0
    $stats['total_dipinjam'] = 0;
}

echo json_encode($stats);

$conn->close();
?>

