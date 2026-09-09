import { AppError } from "./app-error.js";
import type { PaginationParams, ParsedPagination, PaginationMeta } from "../types/pagination.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Validates and parses query pagination parameters.
 * Throws an AppError with 400 status if validation fails.
 */
export const parsePaginationParams = (
  params: PaginationParams
): ParsedPagination => {
  let page = DEFAULT_PAGE;
  let limit = DEFAULT_LIMIT;

  if (params.page !== undefined && params.page !== null && params.page !== "") {
    const rawPage = Number(params.page);
    if (!Number.isInteger(rawPage) || rawPage < 1) {
      throw new AppError("Page must be a positive integer", 400);
    }
    page = rawPage;
  }

  if (params.limit !== undefined && params.limit !== null && params.limit !== "") {
    const rawLimit = Number(params.limit);
    if (!Number.isInteger(rawLimit) || rawLimit < 1) {
      throw new AppError("Limit must be a positive integer", 400);
    }
    if (rawLimit > MAX_LIMIT) {
      throw new AppError(`Limit cannot exceed maximum of ${MAX_LIMIT}`, 400);
    }
    limit = rawLimit;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Calculates pagination metadata from total count and parsed parameters.
export const buildPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / limit) || (totalItems === 0 ? 0 : 1);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1 && page <= totalPages + 1;

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
