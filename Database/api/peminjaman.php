<?php
error_reporting(0);
ini_set('display_errors', 0);

include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $conn->real_escape_string($_GET['id']) : null;

switch ($method) {
    case 'GET':
        $sql = "SELECT p.id_peminjaman, a.nama_anggota, b.judul, p.tgl_pinjam, p.tgl_kembali, p.status 
                FROM peminjaman p
                LEFT JOIN anggota a ON p.id_anggota = a.id_anggota
                LEFT JOIN buku b ON p.id_buku = b.id_buku
                ORDER BY p.tgl_pinjam DESC";
        $result = $conn->query($sql);

        if ($result === false) {
            http_response_code(500);
            echo json_encode(['message' => 'Query SQL Gagal: ' . $conn->error]);
            exit();
        }
        
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        // Mengambil ID Peminjaman dari input manual, bukan auto-generate
        $id_peminjaman = $conn->real_escape_string($input['id_peminjaman']);
        $id_anggota = $conn->real_escape_string($input['id_anggota']);
        $id_buku = $conn->real_escape_string($input['id_buku']);
        $tgl_pinjam = date("Y-m-d H:i:s");
        
        $stmt = $conn->prepare("INSERT INTO peminjaman (id_peminjaman, id_anggota, id_buku, tgl_pinjam) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $id_peminjaman, $id_anggota, $id_buku, $tgl_pinjam);
        
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Buku berhasil dipinjam']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal meminjam buku: ' . $stmt->error]);
        }
        break;

    case 'PUT':
        $tgl_kembali = date("Y-m-d H:i:s");
        $stmt = $conn->prepare("UPDATE peminjaman SET status='Selesai', tgl_kembali=? WHERE id_peminjaman=?");
        $stmt->bind_param("ss", $tgl_kembali, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Buku berhasil dikembalikan']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal mengembalikan buku: ' . $stmt->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}

$conn->close();
?>

