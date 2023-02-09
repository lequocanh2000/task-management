import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
// ** Spinner Import
import Spinner from '@/core/components/spinner'

const account = {
  id: 1,
  name: 'Quoc Anh',
  email: 'quocanh@gmail.com',
  password: 'quocanh',
}

const getUser = (user) => {
  if(!user) return '/login'
  if(user.email === account.email && user.password === account.password)
    return `/${account.id}/overviews`
  else return '/login'
}

export default function Index() {
  const router = useRouter()
  useEffect(()=>{
    const user = localStorage.getItem('user')
    const goPath = getUser(JSON.parse(user))
    router.push(goPath)
  },[])
  return (
    <Container maxWidth="sm">
      <Spinner/>
    </Container>
  );
}
