async function loadAlbumData() {
  const response = await fetch('public/data/albums.json');
  const data = await response.json();
  return data;
}

async function renderAlbums(searchResults) {
  const tableBody = document.getElementById('album-rows');
  tableBody.innerHTML = '';

  if (searchResults && searchResults.length > 0) {
    searchResults.forEach(album => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${album.album || ''}</td>
        <td>${album.releaseDate || ''}</td>
        <td>${album.artistName || ''}</td>
        <td>${album.genres ? album.genres.split(', ').join(', ') : ''}</td>
        <td>${album.averageRating || ''}</td>
        <td>${album.numberReviews || ''}</td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="6">No albums found.</td>`;
    tableBody.appendChild(row);
  }
}

function searchAlbums(data, searchTerm) {
  if (!searchTerm) return null;
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return data.filter(album => {
    return (album.artistName.toLowerCase().includes(lowerCaseSearchTerm) ||
      album.album.toLowerCase().includes(lowerCaseSearchTerm));
  });
}

//Bonus Task 1
function searchByRating(data, minRating) {
  if (!minRating) return null;
  return data.filter(album => album.averageRating >= minRating);
}

//Bonus Task 2
function sortByReleaseDate(data) {
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.releaseDate);
    const dateB = new Date(b.releaseDate);
    return dateB - dateA; // Sort from newest to oldest release date
  });
  return sortedData;
}

document.getElementById('album-search-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const searchTerm = document.getElementById('search-input').value.trim();
  const minRating = parseFloat(document.getElementById('min-album-rating-input').value.trim());

  const albumData = await loadAlbumData();

  let searchResults;

  if (searchTerm) {
    searchResults = searchAlbums(albumData, searchTerm);
  }

  if (minRating) {
    const ratingResults = searchByRating(albumData, minRating);
    searchResults = searchResults ? searchResults.filter(album => ratingResults.includes(album)) : ratingResults;
  }

  renderAlbums(searchResults);
});

// Initial rendering when the page loads
window.addEventListener('load', async function () {
  const albumData = await loadAlbumData();
  
  // Sort by release date
  const sortedByReleaseDate = sortByReleaseDate(albumData);
  renderAlbums(sortedByReleaseDate); // Render the sorted data
  
  // Sort by rating
  const sortedByRating = sortByRating(albumData);
  renderAlbums(sortedByRating); // Render the sorted data
});



