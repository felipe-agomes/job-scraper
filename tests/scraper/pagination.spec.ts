import test, { expect } from "playwright/test";
import type { ConnectorStep } from "../../src/connectors/types";
import { extractAllPages } from "../../src/scraper/pagination";

test("Deve extrair os links de todas as páginas usando paginação dinâmica", async ({
  page,
}) => {
  const mockHTML = `
      <html>
        <body>
          <div id="job-list">
            <a class="vaga" href="https://site.com/vaga-1">Vaga 1</a>
            <a class="vaga" href="https://site.com/vaga-2">Vaga 2</a>
          </div>

          <button id="page-btn-2" onclick="goToPage2()">2</button>

          <script>
            function goToPage2() {
              // Simula o carregamento da página 2
              document.getElementById('job-list').innerHTML = '<a class="vaga" href="https://site.com/vaga-3">Vaga 3</a>';
              // Remove o botão para simular que acabaram as páginas
              document.getElementById('page-btn-2').remove();
            }
          </script>
        </body>
      </html>
    `;

  await page.setContent(mockHTML);

  const paginationConfig = {
    startPage: 1,
    extractStep: {
      name: "Extrair links das vagas",
      action: { type: "attribute", value: "href" },
      locator: { strategy: "css", value: ".vaga" },
    } as ConnectorStep,
    nextPageStep: {
      name: "Ir para próxima página",
      action: { type: "click" },
      // A nossa lógica dinâmica onde o Orquestrador vai injetar o número
      locator: { strategy: "css", value: "#page-btn-{{next_page}}" },
    } as ConnectorStep,
  };

  const resultLinks = await extractAllPages(page, paginationConfig);

  expect(resultLinks).toHaveLength(3);
  expect(resultLinks).toEqual([
    "https://site.com/vaga-1",
    "https://site.com/vaga-2",
    "https://site.com/vaga-3",
  ]);
});

test("Deve parar graciosamente se a página não tiver paginação (apenas página única)", async ({
  page,
}) => {
  const mockHTML = `
      <html>
        <body>
          <a class="vaga" href="https://site.com/vaga-unica">Vaga Única</a>
        </body>
      </html>
    `;
  await page.setContent(mockHTML);

  const paginationConfig = {
    startPage: 1,
    extractStep: {
      name: "Extrair",
      action: { type: "attribute", value: "href" },
      locator: { strategy: "css", value: ".vaga" },
    } as ConnectorStep,
    nextPageStep: {
      name: "Próxima",
      action: { type: "click" },
      locator: { strategy: "css", value: "#page-btn-{{next_page}}" },
    } as ConnectorStep,
  };

  const resultLinks = await extractAllPages(page, paginationConfig);

  expect(resultLinks).toEqual(["https://site.com/vaga-unica"]);
});
