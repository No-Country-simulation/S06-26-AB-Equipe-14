Relatório de Progresso - Backend (App BiT)
Data: 24 de Junho de 2026

Desenvolvedor: Diogo Pereira

Resumo:
Construi a camada de API de dados do backend, implementando os conversores e endpoints que faltavam para expor todas as tabelas modeladas de datasets do Visent Coreview para o frontend. Todos os 7 novos endpoints REST em /api/dados/ estão agora operacionais e prontos para consumo.

Implementações:

1. Conversores de Dados (_to_dict)
Implementei 7 funções de conversão ORM → dicionário que estavam pendentes:
- _tensor_concentracao_to_dict — 16 campos (ecgi, cluster, municipio, dia, período, métricas de uso, lat/lon)
- _tensorfluxovias_to_dict — 15 campos (pares origem-destino com coordenadas e volume de tráfego)
- _tensorod_to_dict — 13 campos (matriz origem-destino agregada por cluster)
- _tensortempodeslocamento_to_dict — 8 campos (distâncias e percentis entre clusters)
- _trajetoscomuns_to_dict — 13 campos (pares OD k-anonimizados K=3, conformidade LGPD)

2. Endpoints novos:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/dados/antena | Registro de antenas com geolocalização |
| GET | /api/dados/assinantes | Perfil demográfico dos assinantes |
| GET | /api/dados/tensor_concentracao | Densidade populacional por antena/período |
| GET | /api/dados/tensorfluxovias | Fluxo de usuários entre antenas |
| GET | /api/dados/tensorod | Matriz origem-destino entre clusters |
| GET | /api/dados/tensortempodeslocamento | Tempos e distâncias de deslocamento |
| GET | /api/dados/trajetoscomuns | Trajetos anonimizados (LGPD) |