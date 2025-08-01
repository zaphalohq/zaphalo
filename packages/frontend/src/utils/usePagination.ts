import { useState } from "react";

export default function usePagination () {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(0)
    return {
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalPages,
        setTotalPages
    }
}