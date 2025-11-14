## Dokumentacja

W projekcie pracowałem z **Angular**, **Node.js** i **MongoDB**.  
Przygotowałem prawidłową strukturę plików w backendzie, wydzielając osobny plik **db.js** do obsługi połączenia z bazą danych.  
Dodatkowo utworzyłem katalog **routes/**, w którym umieściłem trasy API podzielone na logiczne moduły. Dodatkowo zaimplementowałem funkcję inicjalizującą bazę danych, która podczas pierwszego uruchomienia aplikacji sprawdza, czy w kolekcji users istnieje jakikolwiek użytkownik. Jeżeli baza jest pusta, system automatycznie tworzy super użytkownika (administrator) z danymi do pliku logs.json oraz bezpiecznie zahashowanym hasłem. Dodalem dane do bazy danych z pliku data.json i zmienilem wyglad about.component strony
