'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const DetailPage = ({ params }: { params: { id: string } }) => {
    
    const [loading, setLoading] = useState(false)
    
}

export default DetailPage