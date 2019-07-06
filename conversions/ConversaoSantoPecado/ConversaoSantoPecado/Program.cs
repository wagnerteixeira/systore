    using System;

namespace ConversaoSantoPecado
{
    class Program
    {
        static void Main(string[] args)
        {
            new EmitenteConvert().ConverterArquivo(@"/media/wagner/OS/santo_pecado/20_06_2019/emitente.d");
            Console.ReadLine();
        }
    }
}
