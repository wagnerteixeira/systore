    using System;

namespace ConversaoSantoPecado
{
    class Program
    {
        static void Main(string[] args)
        {
            new EmitenteConvert().ConverterArquivo(@"/media/wagner/OS/santo_pecado/07_06_2019/emitente_d_0706");
            Console.ReadLine();
        }
    }
}
