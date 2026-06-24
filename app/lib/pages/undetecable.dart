import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:dio/dio.dart';

class Undetecable extends StatelessWidget {
  const Undetecable({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Undetecable AI'),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
      ),
      body: const UploadPage(),
    );
  }
}

class UploadPage extends StatefulWidget {
  const UploadPage({super.key});

  @override
  State<UploadPage> createState() => _UploadPageState();
}

class _UploadPageState extends State<UploadPage> {
  PlatformFile? selectedFile;
  String? selectedFileName;
  bool _isLoading = false;
  int? _aiPercentage;
  String _statusMessage = "";

  final TextEditingController _fileController = TextEditingController();
  final Dio _dio = Dio();

  // ================= CONTEXT URL BACKEND =================
  // Aktifkan ini jika kamu sedang mengetes menggunakan Chrome web:
  final String _backendUrl =
      "http://localhost:3000/api/v1/analysis/analyze";

  // Aktifkan ini jika nanti kamu mengetes menggunakan Emulator Android resmi:
  // final String _backendUrl = "http://10.0.2.2:3000/api/v1/analysis/analyze";
  // =======================================================

  Future<void> pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'docx'],
      withData: true, // 👈 WAJIB: ambil bytes file sekaligus
    );

    if (result != null) {
      setState(() {
        selectedFile = result.files.single;
        selectedFileName = selectedFile!.name;
        _fileController.text = selectedFileName!;
        _aiPercentage = null;
        _statusMessage = "File terpilih siap dianalisis.";
      });
    }
  }

  Future<void> sendFileToBackend() async {
    if (selectedFile == null || selectedFile!.bytes == null) {
      setState(() {
        _statusMessage = "Silakan pilih file terlebih dahulu!";
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _statusMessage = "Sedang menghubungi backend & memproses...";
    });

    try {
      // Kirim file sebagai multipart/form-data
      final formData = FormData.fromMap({
        "file": MultipartFile.fromBytes(
          selectedFile!.bytes!,
          filename: selectedFile!.name,
        ),
      });

      final Response response = await _dio.post(
        _backendUrl,
        data: formData,
      );

      if (response.statusCode == 200) {
        final int percentage = response.data['data']['percentage'];
        setState(() {
          _aiPercentage = percentage;
          _statusMessage = "Analisis Berhasil!";
        });
      }
    } on DioException catch (dioError) {
      setState(() {
        if (dioError.response != null) {
          _statusMessage =
              "Backend Error (${dioError.response?.statusCode}): ${dioError.response?.data['message'] ?? dioError.response?.data}";
        } else {
          _statusMessage =
              "Koneksi Gagal: ${dioError.message}\n(Periksa CORS atau pastikan backend menyala)";
        }
      });
    } catch (e) {
      setState(() {
        _statusMessage = "Sistem Error: $e";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }


  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (_aiPercentage != null) ...[
            Center(
              child: Stack(
                alignment: Alignment.center,
                children: [
                  SizedBox(
                    width: 130,
                    height: 130,
                    child: CircularProgressIndicator(
                      value: _aiPercentage! / 100,
                      strokeWidth: 10,
                      backgroundColor: Colors.grey[200],
                      valueColor: AlwaysStoppedAnimation<Color>(
                        _aiPercentage! > 50 ? Colors.red : Colors.green,
                      ),
                    ),
                  ),
                  Text(
                    "$_aiPercentage%",
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],

          TextField(
            controller: _fileController,
            readOnly: true,
            decoration: InputDecoration(
              hintText: 'Pilih PDF/Word',
              border: const OutlineInputBorder(),
              suffixIcon: IconButton(
                onPressed: _isLoading ? null : pickFile,
                icon: const Icon(Icons.attach_file),
              ),
            ),
          ),
          const SizedBox(height: 20),

          if (_statusMessage.isNotEmpty) ...[
            Container(
              padding: const EdgeInsets.all(10),
              color: Colors.grey[100],
              child: Text(
                _statusMessage,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.black87,
                  fontWeight: FontWeight.w500,
                  fontSize: 13,
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],

          ElevatedButton.icon(
            onPressed: (_isLoading || selectedFile == null)
                ? null
                : sendFileToBackend,
            icon: _isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Icon(Icons.analytics),
            label: const Text('Mulai Cek Kandungan AI'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 15),
              backgroundColor: Colors.indigo,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
