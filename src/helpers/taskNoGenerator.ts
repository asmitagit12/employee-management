import prisma from '@/lib/prisma';

export async function generateTaskNo(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const prefix = `${year}${month}`;

  try {
    const task = await prisma.task.findFirst({
      where: {
        taskno: {
          startsWith: prefix,
        },
      },
      orderBy: {
        taskno: 'desc',
      },
    });

    let serialNumber = '0001';
    if (task && task.taskno) {  // Ensure task and task.taskno are defined
      const lastSerial = parseInt(task.taskno.slice(-4), 10);
      serialNumber = String(lastSerial + 1).padStart(4, '0');
    }

    return `${prefix}${serialNumber}`;
  } catch (error) {
    console.error('Error fetching task number:', error);
    throw new Error('Unable to generate task number.');
  }
}
