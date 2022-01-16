# configurar google drive

pelo google clod platform

criar um projeto e habilitar o google drive

criar uma conta de serviço, adicionar uma chave, baixar o json

necessário compartilhar a pasta do google drive com o email da conta de serviço.

pegar o id da pasta (na url da pasta) e informar no app

# criar o serviço no windows

`sc.exe create "SystoreWorkerService" DisplayName="Systore Worker Service" start=delayed-auto binpath="C:\Program Files\Systore\Worker\Systore.Worker.Service.exe"`
