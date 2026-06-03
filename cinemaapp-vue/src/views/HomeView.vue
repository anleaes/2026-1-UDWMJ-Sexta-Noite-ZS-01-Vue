<template>
  <main class="page home">
    <h1>CinemaApp</h1>
    <p>Sistema de cinema com área de cliente e administração.</p>

    <div class="actions">
      <RouterLink to="/login">Entrar</RouterLink>
      <RouterLink to="/register">Cadastrar</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
}

h1 {
  color: var(--color-primary-light);
  font-size: 42px;
}

p {
  color: var(--color-muted-light);
}

a {
  background: var(--color-primary);
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: bold;
}
</style>