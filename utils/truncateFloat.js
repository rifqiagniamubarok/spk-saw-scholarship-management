const truncateFloat = (num) => {
  // Memeriksa apakah parameter adalah angka
  if (typeof num !== 'number') {
    throw new Error('Parameter harus berupa angka');
  }

  // Memeriksa apakah angka tersebut adalah float dengan lebih dari 3 angka di belakang koma
  const strNum = num.toString();
  if (strNum.includes('.')) {
    const decimalPart = strNum.split('.')[1];
    if (decimalPart.length > 3) {
      // Memotong angka menjadi maksimal 3 angka di belakang koma
      return parseFloat(num.toFixed(3));
    }
  }

  // Mengembalikan angka tanpa perubahan jika tidak memenuhi kriteria di atas
  return num;
};

export default truncateFloat;
