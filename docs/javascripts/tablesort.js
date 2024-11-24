document$.subscribe(() => {
    document.querySelectorAll("article table:not([class])").forEach(table => new Tablesort(table));
});