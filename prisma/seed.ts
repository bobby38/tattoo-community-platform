import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // --- Seed Styles --- 
  console.log('Seeding Styles...') 
  const stylesData = [
    { name: 'Traditional (Old School)', slug: 'traditional-old-school' }, 
    { name: 'Realism', slug: 'realism' },
    { name: 'Watercolor', slug: 'watercolor' }, 
    { name: 'Tribal', slug: 'tribal' }, 
    { name: 'New School', slug: 'new-school' }, 
    { name: 'Neo Traditional', slug: 'neo-traditional' },
    { name: 'Japanese (Irezumi)', slug: 'japanese-irezumi' },
    { name: 'Blackwork', slug: 'blackwork' }, 
    { name: 'Illustrative', slug: 'illustrative' }, 
    { name: 'Geometric', slug: 'geometric' },
  ];

  for (const style of stylesData) {
    const createdStyle = await prisma.style.upsert({
      where: { slug: style.slug },
      update: {},
      create: style,
    })
    console.log(`Created/updated style with id: ${createdStyle.id}`)
  }
  console.log('Styles seeding finished.')

  // --- Seed Tribes (Example) --- 
  console.log('Seeding Tribes...') 
  const tribesData = [
    { name: 'Polynesian', slug: 'polynesian', iconUrl: '/icons/tribes/polynesian.svg' },
    { name: 'Japanese Style Fans', slug: 'japanese-style-fans', iconUrl: '/icons/tribes/japanese.svg' }, 
    { name: 'Blackwork Enthusiasts', slug: 'blackwork-enthusiasts', iconUrl: '/icons/tribes/blackwork.svg' },
  ];

  for (const tribe of tribesData) {
    const createdTribe = await prisma.tribe.upsert({
      where: { slug: tribe.slug }, 
      update: {},
      create: tribe,
    })
    console.log(`Created/updated tribe with id: ${createdTribe.id}`)
  }
  console.log('Tribes seeding finished.')

  // --- Add more seeding logic here (e.g., for Studios, Artists, Tags) ---
  
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
