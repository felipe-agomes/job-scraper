import xlsx, {
  type ColInfo,
  type RowInfo,
  type WorkBook,
  type WorkSheet,
} from "xlsx";

type NewSheet = {
  name: string;
  data: Record<string, unknown>[];
};

function autoFitColumns(data: Record<string, unknown>[]): ColInfo[] {
  const headers = Object.keys(data[0]!);

  return headers.map((header) => {
    const maxContentWidth = Math.max(
      header.length,
      ...data.map((row) => {
        const text = String(row[header] ?? "");
        return Math.max(...text.split("\n").map((line) => line.length));
      }),
    );

    return { wch: maxContentWidth };
  });
}

function autoFitRows(data: Record<string, unknown>[]): RowInfo[] {
  const baseHeight = 15;

  return [
    { hpt: baseHeight },
    ...data.map((row) => {
      const maxLines = Math.max(
        ...Object.values(row).map(
          (val) => String(val ?? "").split("\n").length,
        ),
      );
      return { hpt: baseHeight * maxLines };
    }),
  ];
}

function createJsonSheet(data: Record<string, unknown>[]): WorkSheet {
  const sheet = xlsx.utils.json_to_sheet(data);

  sheet["!cols"] = autoFitColumns(data);
  sheet["!rows"] = autoFitRows(data);

  return sheet;
}

function createWorkBook(sheets: NewSheet[]): WorkBook {
  const workBook = xlsx.utils.book_new();

  for (const sheet of sheets) {
    xlsx.utils.book_append_sheet(
      workBook,
      createJsonSheet(sheet.data),
      sheet.name,
    );
  }

  return workBook;
}

export { autoFitColumns, autoFitRows, createJsonSheet, createWorkBook };
export type { NewSheet };
