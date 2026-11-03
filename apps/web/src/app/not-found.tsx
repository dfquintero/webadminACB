import Link from 'next/link';

export default function NotFound() {
  return <main style={{ padding: '2rem' }}><h1>Página no encontrada</h1><Link href="/">Volver al panel</Link></main>;
}
