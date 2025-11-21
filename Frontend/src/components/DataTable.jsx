import React, { useState, useMemo } from 'react';
import '../styles/DataTable.css';

export default function DataTable({
  data = [],
  columns = [],
  itemsPerPage = 10,
  searchable = true,
  sortable = true,
  filterable = true,
  onRowClick = null,
  emptyMessage = 'No hay datos para mostrar',
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});

  // Filtrar datos
  const filteredData = useMemo(() => {
    let result = [...data];

    // Aplicar búsqueda global
    if (searchTerm && searchable) {
      result = result.filter((item) =>
        columns.some((col) => {
          const value = col.accessor ? col.accessor(item) : item[col.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Aplicar filtros por columna
    if (filterable) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          result = result.filter((item) => {
            const col = columns.find((c) => c.key === key);
            const value = col?.accessor ? col.accessor(item) : item[key];
            return value?.toString().toLowerCase().includes(filters[key].toLowerCase());
          });
        }
      });
    }

    // Aplicar ordenamiento
    if (sortConfig.key && sortable) {
      result.sort((a, b) => {
        const col = columns.find((c) => c.key === sortConfig.key);
        const aValue = col?.accessor ? col.accessor(a) : a[sortConfig.key];
        const bValue = col?.accessor ? col.accessor(b) : b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return result;
  }, [data, searchTerm, filters, sortConfig, columns, searchable, filterable, sortable]);

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="data-table-container">
      {/* Barra de herramientas */}
      <div className="data-table-toolbar">
        {searchable && (
          <div className="data-table-search">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="data-table-search-input"
            />
          </div>
        )}

        {filterable && (
          <div className="data-table-filters">
            {columns
              .filter((col) => col.filterable !== false)
              .map((col) => (
                <input
                  key={col.key}
                  type="text"
                  placeholder={`Filtrar por ${col.header}...`}
                  value={filters[col.key] || ''}
                  onChange={(e) => handleFilterChange(col.key, e.target.value)}
                  className="data-table-filter-input"
                />
              ))}
          </div>
        )}

        {(searchTerm || Object.values(filters).some((f) => f)) && (
          <button onClick={clearFilters} className="btn-clear-filters">
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={sortable && col.sortable !== false ? 'sortable' : ''}
                >
                  <div className="th-content">
                    {col.header}
                    {sortConfig.key === col.key && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-cell">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={onRowClick ? 'clickable-row' : ''}
                >
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(item)
                        : col.accessor
                        ? col.accessor(item)
                        : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="data-table-pagination">
        <div className="pagination-info">
          Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} de{' '}
          {filteredData.length} resultados
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Anterior
          </button>
          <span className="pagination-page-info">
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

