import { expect, test } from "bun:test";
import {
  autoFitColumns,
  autoFitRows,
  createJsonSheet,
  createWorkBook,
} from "../../../src/utils/report";

const testJson = [
  {
    id: "Teste1",
    description:
      "description 1\ndescription with no more and no less then 51 length\ndescription",
    testHeaderGreatherThenContent: "little content",
  },
  {
    id: "Teste2",
    description: "description 2\nteste",
    testHeaderGreatherThenContent: "little content",
  },
];

test("should return the correct column size", () => {
  expect(autoFitColumns(testJson)).toEqual([
    { wch: 6 },
    { wch: 51 },
    { wch: 29 },
  ]);
});

test("should return the correct row size", () => {
  expect(autoFitRows(testJson)).toEqual([
    { hpt: 15 },
    { hpt: 45 },
    { hpt: 30 },
  ]);
});

test("deve conter os dados corretamente nas células", () => {
  const sheet = createJsonSheet([{ id: "Teste1", description: "desc 1" }]);

  expect(sheet).toBeDefined();
  expect(sheet["!ref"]).toBeDefined();
  expect(sheet["A1"].v).toBe("id");
  expect(sheet["A2"].v).toBe("Teste1");
  expect(sheet["B1"].v).toBe("description");
  expect(sheet["B2"].v).toBe("desc 1");
});

test("deve criar um workbook com as sheets corretas", () => {
  const workbook = createWorkBook([
    { name: "Vendas", data: testJson },
    { name: "Clientes", data: [{ id: "1", name: "João" }] },
  ]);

  expect(workbook.SheetNames).toEqual(["Vendas", "Clientes"]);
  expect(workbook.Sheets["Vendas"]).toBeDefined();
  expect(workbook.Sheets["Clientes"]).toBeDefined();
});
