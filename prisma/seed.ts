import { PrismaClient, FaixaGraduacao, StatusAluno, StatusMensalidade } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🥋 Iniciando seed do TKD Manager (Centro de Treinamento Miguetti Team)...');

  const masterEmail = process.env.MASTER_EMAIL || "";
  const masterPassword = process.env.MASTER_PASSWORD || process.env.SEED_DEFAULT_PASSWORD || '';
  const senhaHash = await bcrypt.hash(masterPassword, 10);

  // 1. Criar Professor Mestre (Sabomim - Usuário Administrativo Principal)
  const professorPrincipal = await prisma.professor.upsert({
    where: { email: masterEmail },
    update: {
      nome: 'Teste professor',
      senhaHash,
      graduacao: 'Faixa Preta 3º Dan',
      ativo: true,
    },
    create: {
      nome: 'Teste professor',
      email: masterEmail,
      senhaHash,
      graduacao: 'Faixa Preta 3º Dan',
      ativo: true,
    },
  });

  console.log(`✅ Professor Mestre semeado: ${professorPrincipal.nome}`);

  // 2. Criar Responsáveis de teste
  const respCarlos = await prisma.responsavel.create({
    data: {
      nome: 'Carlos Eduardo Mendes',
      cpf: '123.456.789-00',
      telefone: '5511987654321',
      parentesco: 'Pai',
    },
  });

  const respMariana = await prisma.responsavel.create({
    data: {
      nome: 'Mariana Ferreira Souza',
      cpf: '987.654.321-11',
      telefone: '5511976543210',
      parentesco: 'Mãe',
    },
  });

  console.log('✅ Responsáveis semeados.');

  // 3. Criar Alunos de teste com matrícula única
  // Aluno 1: Menor de idade (vinculado ao pai)
  const aluno1 = await prisma.aluno.upsert({
    where: { matricula: 'MT-2026-0001' },
    update: {},
    create: {
      matricula: 'MT-2026-0001',
      nome: 'Pedro Henrique Mendes',
      dataNascimento: new Date('2014-05-12'),
      sexo: 'M',
      telefone: '5511987654321',
      email: 'pedro.mendes@email.com',
      endereco: 'Rua das Artes Marciais, 100 - SP',
      faixaAtual: FaixaGraduacao.AMARELA,
      dataUltimoExame: new Date('2026-03-15'),
      status: StatusAluno.ATIVO,
      responsavelId: respCarlos.id,
      valorMensalidadeCents: 15000, // R$ 150,00
    },
  });

  // Aluno 2: Menor de idade (vinculada à mãe)
  const aluno2 = await prisma.aluno.upsert({
    where: { matricula: 'MT-2026-0002' },
    update: {},
    create: {
      matricula: 'MT-2026-0002',
      nome: 'Beatriz Ferreira Souza',
      dataNascimento: new Date('2012-09-20'),
      sexo: 'F',
      telefone: '5511976543210',
      email: 'beatriz.souza@email.com',
      faixaAtual: FaixaGraduacao.VERDE,
      dataUltimoExame: new Date('2026-06-10'),
      status: StatusAluno.ATIVO,
      responsavelId: respMariana.id,
      valorMensalidadeCents: 16000, // R$ 160,00
    },
  });

  // Aluno 3: Maior de idade
  const aluno3 = await prisma.aluno.upsert({
    where: { matricula: 'MT-2026-0003' },
    update: {},
    create: {
      matricula: 'MT-2026-0003',
      nome: 'Rafael Albuquerque Santos',
      dataNascimento: new Date('2000-02-18'),
      sexo: 'M',
      telefone: '5511999887766',
      email: 'rafael.santos@email.com',
      faixaAtual: FaixaGraduacao.AZUL,
      dataUltimoExame: new Date('2026-08-22'),
      status: StatusAluno.ATIVO,
      valorMensalidadeCents: 18000, // R$ 180,00
    },
  });

  // Aluno 4: Maior de idade, Faixa Preta
  const aluno4 = await prisma.aluno.upsert({
    where: { matricula: 'MT-2026-0004' },
    update: {},
    create: {
      matricula: 'MT-2026-0004',
      nome: 'Gabriel Antunes',
      dataNascimento: new Date('1998-11-05'),
      sexo: 'M',
      telefone: '5511988776655',
      email: 'gabriel.antunes@email.com',
      faixaAtual: FaixaGraduacao.PRETA,
      status: StatusAluno.ATIVO,
      valorMensalidadeCents: 20000, // R$ 200,00
    },
  });

  console.log('✅ Alunos semeados.');

  // 5. Criar Mensalidades de teste (Centavos)
  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
  const mesAnterior = `${hoje.getFullYear()}-${String(hoje.getMonth()).padStart(2, '0')}`;

  // Limpar mensalidades anteriores de seed para evitar duplicatas infinitas
  await prisma.mensalidade.deleteMany({
    where: {
      alunoId: { in: [aluno1.id, aluno2.id, aluno3.id, aluno4.id] },
    },
  });

  // Aluno 1: Pago no mês anterior, Pendente neste mês
  await prisma.mensalidade.create({
    data: {
      alunoId: aluno1.id,
      competencia: mesAnterior,
      valorCents: 15000,
      vencimento: new Date(hoje.getFullYear(), hoje.getMonth() - 1, 10),
      status: StatusMensalidade.PAGO,
      pagoEm: new Date(hoje.getFullYear(), hoje.getMonth() - 1, 8),
    },
  });

  await prisma.mensalidade.create({
    data: {
      alunoId: aluno1.id,
      competencia: mesAtual,
      valorCents: 15000,
      vencimento: new Date(hoje.getFullYear(), hoje.getMonth(), 10),
      status: StatusMensalidade.PENDENTE,
    },
  });

  // Aluno 2: Vencido neste mês (para teste do botão WhatsApp)
  await prisma.mensalidade.create({
    data: {
      alunoId: aluno2.id,
      competencia: mesAtual,
      valorCents: 16000,
      vencimento: new Date(hoje.getFullYear(), hoje.getMonth(), 5), // Venceu dia 5
      status: StatusMensalidade.VENCIDO,
    },
  });

  // Aluno 3: Pago neste mês
  await prisma.mensalidade.create({
    data: {
      alunoId: aluno3.id,
      competencia: mesAtual,
      valorCents: 18000,
      vencimento: new Date(hoje.getFullYear(), hoje.getMonth(), 15),
      status: StatusMensalidade.PAGO,
      pagoEm: new Date(hoje.getFullYear(), hoje.getMonth(), 14),
    },
  });

  // 6. Templates padrão de WhatsApp
  await prisma.mensagemTemplate.deleteMany();
  await prisma.mensagemTemplate.createMany({
    data: [
      {
        titulo: 'Lembrete Amigável',
        corpo:
          'Olá, {destinatario}! Tudo bem? Passando para lembrar da mensalidade do(a) aluno(a) {nome_aluno} no valor de {valor} com vencimento para {vencimento} (ref. {competencia}). Centro de Treinamento Miguetti Team agradece!',
        isDefault: true,
      },
      {
        titulo: 'Cobrança no Vencimento',
        corpo:
          'Olá, {destinatario}! Mensagem do Centro de Treinamento Miguetti Team. Lembramos que a mensalidade do aluno(a) {nome_aluno} ({valor}) referente a {competencia} vence em {vencimento}. Fique em dia com os treinos! Dúvidas estamos à disposição.',
        isDefault: false,
      },
      {
        titulo: 'Aviso de Vencimento / Urgente',
        corpo:
          'Olá, {destinatario}! Constatamos que a mensalidade do(a) aluno(a) {nome_aluno} ref. {competencia} ({valor}) venceu em {vencimento}. Pedimos a gentileza de regularizar para mantermos a frequência normal dos treinos. Caso já tenha realizado, favor desconsiderar.',
        isDefault: false,
      },
    ],
  });

  console.log('✅ Mensalidades semeadas com sucesso.');
  console.log('🥋 Seed finalizado!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
