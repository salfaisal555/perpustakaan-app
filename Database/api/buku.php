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
        $sql = "SELECT * FROM buku";
        if ($id) {
            $sql .= " WHERE id_buku='$id'";
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
        $stmt = $conn->prepare("INSERT INTO buku (id_buku, judul, pengarang) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $input['id_buku'], $input['judul'], $input['pengarang']);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Buku berhasil ditambahkan']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal menambahkan buku: ' . $stmt->error]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("UPDATE buku SET judul=?, pengarang=? WHERE id_buku=?");
        $stmt->bind_param("sss", $input['judul'], $input['pengarang'], $id);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Data buku berhasil diupdate']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal mengupdate data: ' . $stmt->error]);
        }
        break;

    case 'DELETE':
        $stmt = $conn->prepare("DELETE FROM buku WHERE id_buku=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Buku berhasil dihapus']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal menghapus buku: ' . $stmt->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}

$conn->close();
?>

