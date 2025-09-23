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
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM anggota";
        if ($id) {
            $sql .= " WHERE id_anggota='$id'";
        }
        $result = $conn->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("INSERT INTO anggota (id_anggota, nama_anggota, no_hp, alamat) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $input['id_anggota'], $input['nama_anggota'], $input['no_hp'], $input['alamat']);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Anggota berhasil ditambahkan']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal menambahkan anggota: ' . $stmt->error]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("UPDATE anggota SET nama_anggota=?, no_hp=?, alamat=? WHERE id_anggota=?");
        $stmt->bind_param("ssss", $input['nama_anggota'], $input['no_hp'], $input['alamat'], $id);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Data anggota berhasil diupdate']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal mengupdate data: ' . $stmt->error]);
        }
        break;

    case 'DELETE':
        $stmt = $conn->prepare("DELETE FROM anggota WHERE id_anggota=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Anggota berhasil dihapus']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal menghapus anggota: ' . $stmt->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}

$conn->close();
?>

