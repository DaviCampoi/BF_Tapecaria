/*
  Este componente exibe um catálogo dos serviços oferecidos pela empresa.
  - Lista serviços com imagem, título e descrição detalhada.
  - Permite ampliar a foto ao clicar na imagem (overlay).
  - Inclui seção de "Outros Serviços" com informações adicionais e link para contato.
  - Utiliza componentes Navbar e Footer para manter a estrutura da página.
  - Organiza os serviços em cards responsivos, destacando cada tipo de estofamento ou revestimento.
*/

import React, { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import bancoCouro from "../assets/bancodecourocataloco.jpg"
import charrete from "../assets/charrete.jpg"
import volante from "../assets/volantedocataloco.jpg"
import teto from "../assets/teto.jpg"
import bancoMoto from "../assets/bancodemoto.jpg"
import trocaFaixa from "../assets/antes_e_depois.png"

export default function Catalogo() {
  const [fotoAmpliada, setFotoAmpliada] = useState(null)

  const servicos = [
    {
      imagem: bancoCouro,
      titulo: "Bancos em Couro Legítimo e Sintético",
      descricao:
        "Oferecemos revestimento completo de bancos em couro legítimo ou sintético, proporcionando mais sofisticação, conforto e valorização ao veículo. Trabalhamos com materiais de alta qualidade e diversas opções de cores, além de personalização de costuras e acabamentos."
    },

    {
      imagem: trocaFaixa,
      titulo: "Troca de Faixa de Banco",
      descricao:
        "Realizamos a substituição parcial de faixas desgastadas ou mudamos as cores e materiais para personalizar o assento sem precisar reformar o banco inteiro."
    },

    {
      imagem: bancoMoto,
      titulo: "Bancos de Motocicletas",
      descricao:
        "Reforma e personalização de bancos de motos de todos os estilos. Utilizamos espumas de alta densidade e materiais antiderrapantes para garantir máximo conforto em viagens longas e um visual exclusivo para sua moto."
    },

    {
      imagem: charrete,
      titulo: "Estofamento de Charretes",
      descricao:
        "Realizamos estofamento completo para charretes, utilizando materiais resistentes ao uso externo e às variações climáticas. Nosso trabalho combina tradição artesanal com técnicas modernas para durabilidade e estética."
    },

    {
      imagem: volante,
      titulo: "Revestimento de Volantes",
      descricao:
        "Fazemos revestimento de volantes com costura manual e acabamento profissional. O serviço proporciona melhor aderência, conforto ao dirigir e renovação do interior do carro, com opções de personalização."
    },

    {
      imagem: teto,
      titulo: "Revestimento de Teto",
      descricao:
        "Especializados na recuperação de tetos automotivos para veículos modernos e clássicos. Utilizamos materiais de qualidade para garantir um acabamento uniforme e elegante no interior do veículo."
    }
  ]

  return (
    <div className="page-navbar">
      <Navbar />

      <section className="catalogo">
        <h2 className="catalogo-titulo">Nossos Serviços</h2>

        <div className="catalogo-lista">
          {servicos.map((servico, index) => (
            <div className="catalogo-card" key={index}>
              <div
                className="catalogo-imagem"
                onClick={() => setFotoAmpliada(servico.imagem)}
              >
                <img src={servico.imagem} alt={servico.titulo} />
              </div>

              <div className="catalogo-info">
                <h3>{servico.titulo}</h3>
                <p>{servico.descricao}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="catalogo-extra">
          <h3>Outros Serviços</h3>

          <p>
            Manutenção de espumas, reparos em forrações de portas e ajustes
            estruturais para garantir o máximo conforto.
          </p>

          <p>
            Qualquer dúvida,{" "}
            <Link to="/contato" className="catalogo-link">
              clique aqui
            </Link>
          </p>
        </div>
      </section>

      {fotoAmpliada && (
        <div className="overlay" onClick={() => setFotoAmpliada(null)}>
          <img className="imagem-ampliada" src={fotoAmpliada} alt="Ampliada" />
        </div>
      )}

      <Footer />
    </div>
  )
}